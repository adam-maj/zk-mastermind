import React from "react";

export default function Home() {
  React.useEffect(() => {
    fetch("/api/proof");
  }, []);

  return <div>Hello World</div>;
}
