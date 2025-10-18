import { WebReviewModel } from "../db/models/webReviews.js";

export const createReview = async (reviewData) => {
  return await WebReviewModel.create(reviewData);
};

export const getReviews = async (limit = 10, page = 1) => {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    WebReviewModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    WebReviewModel.countDocuments(),
  ]);

  return {
    reviews,
    total,
    page,
    perPage: limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateReviewReaction = async (id, type, userId) => {
  if (!["like", "dislike"].includes(type)) return null;

  try {
    // First, get the review to check if user already reacted
    const review = await WebReviewModel.findById(id);
    if (!review) return null;

    // Get user info to check if they're trying to like their own review
    const { UsersCollection } = await import("../db/models/auth.js");
    const user = await UsersCollection.findById(userId);
    if (!user) return null;

    // Check if user is trying to like their own review
    const userFullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    if (review.name === userFullName) {
      return "cannot like own review";
    }

    // Check if user already liked or disliked
    const alreadyLiked = review.likedBy.includes(userId);
    const alreadyDisliked = review.dislikedBy.includes(userId);

    if (type === "like") {
      if (alreadyLiked) return "already liked";
      if (alreadyDisliked) {
        // Remove from dislikes and add to likes
        await WebReviewModel.findByIdAndUpdate(id, {
          $pull: { dislikedBy: userId },
          $push: { likedBy: userId },
          $inc: { dislikes: -1, likes: 1 }
        });
      } else {
        // Just add to likes
        await WebReviewModel.findByIdAndUpdate(id, {
          $push: { likedBy: userId },
          $inc: { likes: 1 }
        });
      }
    } else if (type === "dislike") {
      if (alreadyDisliked) return "already disliked";
      if (alreadyLiked) {
        // Remove from likes and add to dislikes
        await WebReviewModel.findByIdAndUpdate(id, {
          $pull: { likedBy: userId },
          $push: { dislikedBy: userId },
          $inc: { likes: -1, dislikes: 1 }
        });
      } else {
        // Just add to dislikes
        await WebReviewModel.findByIdAndUpdate(id, {
          $push: { dislikedBy: userId },
          $inc: { dislikes: 1 }
        });
      }
    }

    // Return updated review
    return await WebReviewModel.findById(id);
  } catch (error) {
    console.error('Error in updateReviewReaction:', error);
    throw new Error('Failed to update review reaction');
  }
};

export const deleteReviewById = async (id) => {
  return await WebReviewModel.findByIdAndDelete(id);
};
