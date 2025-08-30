// components/AdsList.tsx
import AdCard from "./AdCard";

const mockAds = [
  {
    id: "1",
    title: "Experienced Plumber",
    description: "Available for quick repairs in Colombo",
    price: "Rs. 2,500 per visit",
    location: "Colombo",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    title: "Carpenter for hire",
    description: "Furniture repairs & custom work",
    price: "Rs. 3,000 per job",
    location: "Kandy",
    image: "https://via.placeholder.com/150",
  },
];

interface AdsListProps {
  filters: { search: string; skill: string; location: string };
  onAdSelect: (id: string) => void;
}

export default function AdsList({ filters, onAdSelect }: AdsListProps) {
  const filteredAds = mockAds.filter((ad) => {
    return (
      (!filters.search || ad.title.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.skill || ad.title.toLowerCase().includes(filters.skill.toLowerCase())) &&
      (!filters.location || ad.location === filters.location)
    );
  });

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {filteredAds.map((ad) => (
        <AdCard key={ad.id} ad={ad} onSelect={onAdSelect} />
      ))}
      {filteredAds.length === 0 && <p>No ads found</p>}
    </div>
  );
}
