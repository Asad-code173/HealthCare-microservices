import RegisterForm from "@/components/forms/RegisterForm";

const page = async () => {
  const user = {
    name: "Asad Ali",
    email: "asad@gmail.com",
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <RegisterForm user={user} />
      </div>
    </div>
  );
};

export default page;