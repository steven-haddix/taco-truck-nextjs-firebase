import { Center, Container, Text } from "@mantine/core";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const { loadingUser, user } = useUser();

  const finalizeSetup = async () => {
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const { code, state } = router.query;

      const res = await fetch(`/api/auth?code=${code}&state=${state}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await res.json();
      setLoading(false);

      if (res.ok) {
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    // Wait for user so we have a JWT to pass
    if (!loadingUser) {
      finalizeSetup();
    }
  }, [loadingUser]);

  return (
    <Container>
      <Center>
        {loading && <Text>We're finalizing your setup! Hang tight.</Text>}
        {!loading && <Text>All setup!</Text>}
      </Center>
    </Container>
  );
};

export default DashboardPage;
