export const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Invalid date";
  
    const updated = new Date(dateString);
    if (isNaN(updated.getTime())) return "Invalid date";
  
    const diffHours = Math.floor((Date.now() - updated.getTime()) / (1000 * 60 * 60));
    return `${diffHours} hours ago`;
  };