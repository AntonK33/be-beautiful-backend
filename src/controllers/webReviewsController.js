import * as reviewService from "../services/webReviews.js";

export const postReview = async (req, res, next) => {
  try {
    const { name, location, rating, comment } = req.body;

    if (!name || !location || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const review = await reviewService.createReview({
      name,
      location,
      rating,
      comment,
    });

    res.status(201).json({
      status: 201,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const result = await reviewService.getReviews(Number(limit), Number(page));

    res.status(200).json({
      status: 200,
      message: "Reviews fetched successfully",
      data: result.reviews,
      pagination: {
        total: result.total,
        page: result.page,
        perPage: result.perPage,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const reactToReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user; // Fixed: authMiddleware sets req.user directly

    if (!["like", "dislike"].includes(type)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const result = await reviewService.updateReviewReaction(id, type, userId);

    if (result === "already liked" || result === "already disliked") {
      return res
        .status(400)
        .json({ message: `You already ${result.split(" ")[1]} this review.` });
    }

    if (result === "cannot like own review") {
      return res
        .status(400)
        .json({ message: "You cannot like your own review." });
    }

    if (!result) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      status: 200,
      message: `Review ${type}d successfully`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await reviewService.deleteReviewById(id);

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};
