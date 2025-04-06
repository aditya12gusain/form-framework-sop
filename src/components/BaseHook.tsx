import { FormData, useDntelForm } from "@/hooks";
import sampleData from "@/data/input.json";

const BaseHook = () => {
    const [FormComponent, {}] = useDntelForm(
        sampleData as FormData,
        "patient-form-2"
    );
    return (
        <section className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Base Implementation</h1>
                    <p className="text-gray-500 mt-1">
                        This is the base implementation of the Dntel Form with
                        only hooks
                    </p>
                </div>
            </div>
            {FormComponent}
        </section>
    );
};

export default BaseHook;
