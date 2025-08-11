"use server";

import { prisma } from "@/lib/prisma";
import {
  transformFacilityToVenueListItem,
  transformFacilityToVenueDetails,
  transformTimeSlots,
  checkSlotAvailability as checkSlotAvailabilityUtil,
  type VenueListItem,
  type VenueDetails,
  type TimeSlot,
  type VenueFilters,
} from "@/lib/venue-transformers";
import { type SportType } from "@/generated/prisma";

/**
 * Get venues with filtering and sorting support
 */
export async function getVenues(
  filters?: VenueFilters & {
    sortBy?: "rating" | "price-low" | "price-high" | "name" | "availability";
    limit?: number;
    offset?: number;
  },
): Promise<VenueListItem[]> {
  try {
    // Build where clause based on filters
    const whereClause: any = {
      status: "APPROVED", // Only show approved facilities
    };

    // Sport type filter - need to check if facility has courts with this sport
    if (filters?.sportType && filters.sportType !== "ALL") {
      whereClause.courts = {
        some: {
          sportType: filters.sportType,
          isActive: true,
        },
      };
    }

    // Venue type filter
    if (filters?.venueType && filters.venueType !== "ALL") {
      whereClause.venueType = filters.venueType;
    }

    // Location filter
    if (filters?.location) {
      whereClause.address = {
        contains: filters.location,
        mode: "insensitive",
      };
    }

    // Search query filter
    if (filters?.searchQuery) {
      whereClause.OR = [
        {
          name: {
            contains: filters.searchQuery,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: filters.searchQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters.searchQuery,
            mode: "insensitive",
          },
        },
      ];
    }

    // Rating filter
    if (filters?.minRating !== undefined) {
      whereClause.rating = {
        gte: filters.minRating,
      };
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: "desc" }; // Default sort

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "rating":
          orderBy = { rating: "desc" };
          break;
        case "price-low":
          // This is complex as we need to sort by minimum court price
          // For now, we'll sort by name and handle price sorting in memory
          orderBy = { name: "asc" };
          break;
        case "price-high":
          orderBy = { name: "asc" };
          break;
        case "name":
          orderBy = { name: "asc" };
          break;
        case "availability":
          orderBy = { rating: "desc" }; // Fallback to rating
          break;
      }
    }

    // Query facilities with related data
    const facilities = await prisma.facility.findMany({
      where: whereClause,
      include: {
        courts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            sportType: true,
            pricePerHour: true,
            operatingStartHour: true,
            operatingEndHour: true,
            isActive: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy,
      take: filters?.limit,
      skip: filters?.offset,
    });

    // Transform to venue list items
    let venues = facilities.map(transformFacilityToVenueListItem);

    // Apply price filters in memory (since we need to calculate min price from courts)
    if (filters?.minPrice !== undefined) {
      venues = venues.filter((venue) => venue.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      venues = venues.filter((venue) => venue.price <= filters.maxPrice!);
    }

    // Apply price sorting in memory
    if (filters?.sortBy === "price-low") {
      venues.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === "price-high") {
      venues.sort((a, b) => b.price - a.price);
    } else if (filters?.sortBy === "availability") {
      venues.sort((a, b) => {
        if (
          a.availability === "Available Now" &&
          b.availability !== "Available Now"
        ) {
          return -1;
        }
        if (
          b.availability === "Available Now" &&
          a.availability !== "Available Now"
        ) {
          return 1;
        }
        return b.rating - a.rating;
      });
    }

    return venues;
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw new Error("Failed to fetch venues");
  }
}

/**
 * Get detailed venue information by ID
 */
export async function getVenueById(id: string): Promise<VenueDetails | null> {
  try {
    const facility = await prisma.facility.findUnique({
      where: {
        id,
        status: "APPROVED", // Only show approved facilities
      },
      include: {
        courts: {
          where: { isActive: true },
          include: {
            timeSlots: {
              where: {
                startTime: {
                  gte: new Date(), // Only future time slots
                },
              },
              include: {
                booking: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
              },
              orderBy: {
                startTime: "asc",
              },
              take: 50, // Limit to avoid too much data
            },
          },
        },
        reviews: {
          include: {
            player: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Latest 10 reviews
        },
      },
    });

    if (!facility) {
      return null;
    }

    return transformFacilityToVenueDetails(facility);
  } catch (error) {
    console.error("Error fetching venue by ID:", error);
    throw new Error("Failed to fetch venue details");
  }
}

/**
 * Get time slots for a venue on a specific date
 */
export async function getVenueTimeSlots(
  venueId: string,
  date: Date,
): Promise<TimeSlot[]> {
  try {
    // Normalize the date to start and end of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const facility = await prisma.facility.findUnique({
      where: {
        id: venueId,
        status: "APPROVED",
      },
      include: {
        courts: {
          where: { isActive: true },
          include: {
            timeSlots: {
              where: {
                startTime: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
              include: {
                booking: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
              },
              orderBy: {
                startTime: "asc",
              },
            },
          },
        },
      },
    });

    if (!facility) {
      throw new Error("Venue not found");
    }

    return transformTimeSlots(facility.courts, date);
  } catch (error) {
    console.error("Error fetching venue time slots:", error);
    throw new Error("Failed to fetch time slots");
  }
}

/**
 * Check if a specific time slot is available for booking
 */
export async function checkSlotAvailability(
  courtId: string,
  startTime: Date,
): Promise<boolean> {
  try {
    const timeSlot = await prisma.timeSlot.findFirst({
      where: {
        courtId,
        startTime,
      },
      include: {
        booking: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!timeSlot) {
      // If no time slot exists, we need to check if the court is operating at this time
      const court = await prisma.court.findUnique({
        where: { id: courtId },
        select: {
          operatingStartHour: true,
          operatingEndHour: true,
          isActive: true,
        },
      });

      if (!court?.isActive) {
        return false;
      }

      const hour = startTime.getHours();
      return hour >= court.operatingStartHour && hour < court.operatingEndHour;
    }

    return checkSlotAvailabilityUtil(timeSlot);
  } catch (error) {
    console.error("Error checking slot availability:", error);
    throw new Error("Failed to check slot availability");
  }
}

/**
 * Get venues by sport type (helper function)
 */
export async function getVenuesBySport(
  sportType: SportType,
  limit?: number,
): Promise<VenueListItem[]> {
  return getVenues({
    sportType,
    limit,
    sortBy: "rating",
  });
}

/**
 * Get popular venues (helper function)
 */
export async function getPopularVenues(limit = 10): Promise<VenueListItem[]> {
  return getVenues({
    minRating: 4.0,
    limit,
    sortBy: "rating",
  });
}

/**
 * Search venues by query (helper function)
 */
export async function searchVenues(
  query: string,
  limit?: number,
): Promise<VenueListItem[]> {
  return getVenues({
    searchQuery: query,
    limit,
    sortBy: "rating",
  });
}

/**
 * Get venue availability summary for a date range
 */
export async function getVenueAvailabilitySummary(
  venueId: string,
  startDate: Date,
  endDate: Date,
): Promise<{
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  maintenanceSlots: number;
  availabilityPercentage: number;
}> {
  try {
    const facility = await prisma.facility.findUnique({
      where: {
        id: venueId,
        status: "APPROVED",
      },
      include: {
        courts: {
          where: { isActive: true },
          include: {
            timeSlots: {
              where: {
                startTime: {
                  gte: startDate,
                  lte: endDate,
                },
              },
              include: {
                booking: {
                  select: {
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!facility) {
      throw new Error("Venue not found");
    }

    let totalSlots = 0;
    let availableSlots = 0;
    let bookedSlots = 0;
    let maintenanceSlots = 0;

    for (const court of facility.courts) {
      for (const slot of court.timeSlots) {
        totalSlots++;

        if (slot.isMaintenanceBlocked) {
          maintenanceSlots++;
        } else if (slot.booking && slot.booking.status === "CONFIRMED") {
          bookedSlots++;
        } else {
          availableSlots++;
        }
      }
    }

    const availabilityPercentage =
      totalSlots > 0 ? Math.round((availableSlots / totalSlots) * 100) : 0;

    return {
      totalSlots,
      availableSlots,
      bookedSlots,
      maintenanceSlots,
      availabilityPercentage,
    };
  } catch (error) {
    console.error("Error getting venue availability summary:", error);
    throw new Error("Failed to get availability summary");
  }
}

/**
 * Get top-rated venues for home page by location
 */
export async function getTopVenuesByLocation(
  location?: string,
  limit = 4,
): Promise<VenueListItem[]> {
  try {
    // Build where clause for location filtering
    const whereClause: any = {
      status: "APPROVED", // Only show approved facilities
    };

    // Location filter - search in address for city/area name
    if (location && location.trim() !== "") {
      whereClause.address = {
        contains: location,
        mode: "insensitive", // Case-insensitive search
      };
    }

    // Fetch venues with courts and reviews
    const facilities = await prisma.facility.findMany({
      where: whereClause,
      include: {
        courts: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            sportType: true,
            pricePerHour: true,
            operatingStartHour: true,
            operatingEndHour: true,
            isActive: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [
        { rating: "desc" }, // Order by rating first
        { reviewCount: "desc" }, // Then by review count
        { createdAt: "desc" }, // Finally by creation date
      ],
      take: limit * 2, // Get more than needed to account for filtering
    });

    // Transform to VenueListItem format
    const venueItems = facilities
      .map((facility) => {
        try {
          return transformFacilityToVenueListItem(facility);
        } catch (error) {
          console.error(`Error transforming facility ${facility.id}:`, error);
          return null;
        }
      })
      .filter((item): item is VenueListItem => item !== null)
      .slice(0, limit); // Take only the requested number

    return venueItems;
  } catch (error) {
    console.error("Error getting top venues by location:", error);
    throw new Error("Failed to get top venues");
  }
}

/**
 * Get sports categories with venue counts
 */
export async function getSportsCategories(): Promise<
  Array<{
    name: string;
    image: string;
    venues: number;
    sportType: SportType;
  }>
> {
  try {
    // Get count of venues for each sport type
    const sportCounts = await prisma.court.groupBy({
      by: ["sportType"],
      where: {
        isActive: true,
        facility: {
          status: "APPROVED",
        },
      },
      _count: {
        facilityId: true,
      },
    });

    // Sport type to display name and image mapping
    const sportMapping: Record<SportType, { name: string; image: string }> = {
      BADMINTON: {
        name: "Badminton",
        image: "/assets/professional-badminton-court.png",
      },
      FOOTBALL: {
        name: "Football",
        image: "/assets/football-turf-ground.png",
      },
      CRICKET: {
        name: "Cricket",
        image: "/assets/cricket-ground-pavilion.png",
      },
      TENNIS: {
        name: "Tennis",
        image: "/assets/indoor-tennis-court.png",
      },
      BASKETBALL: {
        name: "Basketball",
        image: "/assets/outdoor-basketball-court.png",
      },
      VOLLEYBALL: {
        name: "Volleyball",
        image: "/assets/outdoor-basketball-court.png",
      },
      SQUASH: {
        name: "Squash",
        image: "/assets/indoor-tennis-court.png",
      },
      TABLE_TENNIS: {
        name: "Table Tennis",
        image: "/assets/professional-badminton-court.png",
      },
    };

    // Transform the data
    const categories = sportCounts
      .map((count) => {
        const mapping = sportMapping[count.sportType];
        if (!mapping) return null;

        return {
          name: mapping.name,
          image: mapping.image,
          venues: count._count.facilityId,
          sportType: count.sportType,
        };
      })
      .filter(
        (category): category is NonNullable<typeof category> =>
          category !== null,
      )
      .sort((a, b) => b.venues - a.venues); // Sort by venue count descending

    return categories;
  } catch (error) {
    console.error("Error getting sports categories:", error);
    throw new Error("Failed to get sports categories");
  }
}

/**
 * Get platform statistics for home page
 */
export async function getPlatformStats(): Promise<{
  venues: number;
  players: number;
  sports: number;
}> {
  try {
    // Get venue count (approved facilities)
    const venueCount = await prisma.facility.count({
      where: {
        status: "APPROVED",
      },
    });

    // Get player count (active player profiles)
    const playerCount = await prisma.playerProfile.count({
      where: {
        isActive: true,
        isBanned: false,
      },
    });

    // Get sports count (unique sport types with active courts)
    const sportsResult = await prisma.court.findMany({
      where: {
        isActive: true,
        facility: {
          status: "APPROVED",
        },
      },
      select: {
        sportType: true,
      },
      distinct: ["sportType"],
    });

    const sportsCount = sportsResult.length;

    return {
      venues: venueCount,
      players: playerCount,
      sports: sportsCount,
    };
  } catch (error) {
    console.error("Error getting platform stats:", error);
    throw new Error("Failed to get platform statistics");
  }
}

/**
 * Get venue reviews with pagination
 */
export async function getVenueReviews(
  venueId: string,
  page = 1,
  limit = 10,
): Promise<{
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    verified: boolean;
    createdAt: Date;
    player: {
      user: {
        name: string;
      };
    };
  }>;
  totalReviews: number;
  averageRating: number;
  hasMore: boolean;
}> {
  try {
    const offset = (page - 1) * limit;

    // Get reviews with pagination
    const [reviews, totalReviews, ratingStats] = await Promise.all([
      prisma.facilityReview.findMany({
        where: {
          facilityId: venueId,
        },
        include: {
          player: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.facilityReview.count({
        where: {
          facilityId: venueId,
        },
      }),
      prisma.facilityReview.aggregate({
        where: {
          facilityId: venueId,
        },
        _avg: {
          rating: true,
        },
      }),
    ]);

    const hasMore = offset + reviews.length < totalReviews;
    const averageRating = ratingStats._avg.rating ?? 0;

    return {
      reviews,
      totalReviews,
      averageRating,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching venue reviews:", error);
    throw new Error("Failed to fetch venue reviews");
  }
}

/**
 * Calculate and update venue rating
 */
export async function updateVenueRating(venueId: string): Promise<void> {
  try {
    // Calculate new rating and review count
    const [ratingStats, reviewCount] = await Promise.all([
      prisma.facilityReview.aggregate({
        where: {
          facilityId: venueId,
        },
        _avg: {
          rating: true,
        },
      }),
      prisma.facilityReview.count({
        where: {
          facilityId: venueId,
        },
      }),
    ]);

    const averageRating = ratingStats._avg.rating ?? 0;

    // Update facility with new rating and review count
    await prisma.facility.update({
      where: {
        id: venueId,
      },
      data: {
        rating: averageRating,
        reviewCount,
      },
    });
  } catch (error) {
    console.error("Error updating venue rating:", error);
    throw new Error("Failed to update venue rating");
  }
}

/**
 * Get venue rating summary
 */
export async function getVenueRatingSummary(venueId: string): Promise<{
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}> {
  try {
    const [reviews, ratingStats] = await Promise.all([
      prisma.facilityReview.findMany({
        where: {
          facilityId: venueId,
        },
        select: {
          rating: true,
        },
      }),
      prisma.facilityReview.aggregate({
        where: {
          facilityId: venueId,
        },
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    const averageRating = ratingStats._avg.rating ?? 0;
    const totalReviews = ratingStats._count.id;

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((review) => review.rating === rating).length;
      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
      return { rating, count, percentage };
    });

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
    };
  } catch (error) {
    console.error("Error fetching venue rating summary:", error);
    throw new Error("Failed to fetch venue rating summary");
  }
}
