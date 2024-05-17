import { Loading } from "@/components/loading";
import { CreateProjectForm } from "../components/create-project";

export default function CreateProjectPage() {

  return (
    <div className="h-full flex justify-center items-center">
      <CreateProjectForm />
      <Loading />
    </div>
  );
}
