export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export const categoryColors = {
  Entertainment: "#ff7a59",
  Health: "#4dd4ac",
  Education: "#f5c76c",
  Productivity: "#5b8cff",
  Lifestyle: "#ffb86a",
  Utilities: "#6ee7f0",
  Other: "#94a3b8",
};
