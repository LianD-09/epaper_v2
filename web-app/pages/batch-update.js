import Menu from "@/components/menu";
import Layout from "@/components/layout";
import React, { useState, useEffect } from "react";
import BatchUpdate from "@/components/batch-update"
import Cookies from "universal-cookie";
import Link from "next/link";
import validToken from "@/services/validToken";

function UpdatePage() {
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("TOKEN"));

  useEffect(() => {
    const token = cookies.get("TOKEN");
    if (validToken(token)) {
      setToken(token);
    } else {
      setToken(null);
    }

  }, [token]);

  return (
    <Layout pageTitle="Batch Update | Epaper">
      <div className="dashboard dark:bg-[#212121] bg-[#e0e0e0] dark:text-white text-black h-screen bg-center bg-cover bg-no-repeat flex items-center">
        {token ? (
          <>
            <Menu currentPath={"Batch Update"} />
            <div className="main-container">
                <BatchUpdate />
            </div>
          </>
        ) : (
          <div className="main-container">
            <div className="content">
              <p>You are not logged in. Please log in to continue.</p>
              <button className="ok mt-5">
                <Link href="/login">Log In</Link>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UpdatePage;
