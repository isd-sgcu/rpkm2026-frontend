import { getProjectName, type GetProjectNameResponse } from "@lib/api/sample";
import { useEffect, useState } from "react";

export function SamplePanel() {
  const [project, setProject] = useState<GetProjectNameResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectName = async () => {
      try {
        const data = await getProjectName();
        setProject(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load project data");
      }
    };

    loadProjectName();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (project === null) {
    return <p>Loading…</p>;
  }

  return (
    <section className="grid gap-6 rounded-lg bg-white p-6">
      <p>From the API</p>
      <h2>
        Project Name: {project.name}, Project Version: {project.version}
      </h2>
    </section>
  );
}
