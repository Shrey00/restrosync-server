async function makeRequest() {
  const response = await fetch("https://offers.kitchendailyshop.com/api_services/manage.php", {
    method: "POST",
  });
//   const data = await response.json();
//   console.log(data)
//   await makeRequest();
}
makeRequest();
