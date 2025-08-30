// components/AdCard.tsx
interface Ad {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  image: string;
}

interface AdCardProps {
  ad: Ad;
  onSelect: (id: string) => void;
}

export default function AdCard({ ad, onSelect }: AdCardProps) {
  return (
    <div
      onClick={() => onSelect(ad.id)}
      className="border rounded-lg shadow-md bg-white hover:shadow-lg cursor-pointer flex p-4 space-x-4"
    >
      <img src={ad.image} alt={ad.title} className="w-32 h-32 object-cover rounded-md" />
      <div>
        <h3 className="font-bold text-lg">{ad.title}</h3>
        <p className="text-gray-600">{ad.description}</p>
        <p className="text-green-700 font-bold">{ad.price}</p>
        <p className="text-sm text-gray-500">{ad.location}</p>
      </div>
    </div>
  );
}
