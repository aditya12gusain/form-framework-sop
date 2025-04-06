import { createBrowserRouter } from "react-router-dom";
import BaseHook from "./components/BaseHook";
import AdvanceHookImplementation from "./components/AdvanceHookImplementation";
import Navigation from "./components/Navigation";

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen">
        <Navigation />
        <main className="p-4">{children}</main>
    </div>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <BaseHook />
            </Layout>
        ),
    },
    {
        path: "/advanced",
        element: (
            <Layout>
                <AdvanceHookImplementation />
            </Layout>
        ),
    },
]);
