const saveVisitor = async () => {
  const data = await fetch("/api/visitor", {
    method: "POST",
    body: JSON.stringify({
      path: window.location.pathname,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await data.json();
  console.log(result);
};

export default saveVisitor;
