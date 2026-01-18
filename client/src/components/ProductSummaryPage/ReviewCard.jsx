import { StarRating } from "./StarRating";

export const ReviewCard = ({ review }) => {
  const userName = review?.user?.name || "Anonymous";

  return (
    <div className="border-bottom py-4">
      <div className="d-flex align-items-start">
        <div
          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
          style={{ width: 48, height: 48 }}
        >
          {userName.charAt(0)}
        </div>

        <div>
          <StarRating value={review.rating} />
          <div className="fw-semibold">{review.title}</div>

          <div className="text-muted small">
            by {userName} • {new Date(review.createdAt).toLocaleDateString()}
            {review.isVerifiedPurchase && (
              <span className="ms-2 text-success">✔ Verified Buyer</span>
            )}
          </div>

          <p className="mt-2 mb-1">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};
