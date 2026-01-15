export const StarRating = ({ value }) => {
  const rounded = Math.round(value * 2) / 2;

  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rounded ? "text-warning" : "text-muted"}>
          ★
        </span>
      ))}
    </div>
  );
};
