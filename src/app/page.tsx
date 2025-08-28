import MissingPersonProfile from "@/components/missing-person-profile";

export default function Home() {
  // Sample data based on your requirements
  const sampleData = {
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "February 22, 1990",
    placeOfBirth: "Joplin, Missouri", 
    hair: "Light brown",
    eyes: "Blue",
    height: "5'7\" (at the time of her disappearance)",
    weight: "170 pounds (at the time of her disappearance)",
    sex: "Female",
    race: "White",
    missingSince: "July 16, 2018",
    // image1: "/path/to/image1.jpg", // Uncomment and add real image paths
    // image2: "/path/to/image2.jpg", // Uncomment and add real image paths
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MissingPersonProfile data={sampleData} />
    </div>
  );
}
