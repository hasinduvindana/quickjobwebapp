import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { JobPost } from "@/lib/types"; // Assuming JobPost is defined in types.ts

const firestore = getFirestore();

const useJobDetails = (jobId: string) => {
  const [jobDetails, setJobDetails] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDoc = doc(firestore, "jobposts", jobId);
        const jobSnapshot = await getDoc(jobDoc);

        if (jobSnapshot.exists()) {
          setJobDetails({ id: jobSnapshot.id, ...jobSnapshot.data() } as JobPost);
        } else {
          setError("Job not found");
        }
      } catch (err) {
        setError("Error fetching job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  return { jobDetails, loading, error };
};

export default useJobDetails;