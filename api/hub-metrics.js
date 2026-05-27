export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }

  try {
    const appsScriptUrl = "https://script.google.com/macros/s/AKfycbzG049iRQSReR4dBka-KH0_R1InG8MPD5QEHpqROU5RohCECZ4ey9UeRh1PwI3Tp6PQ/exec";
    
    // Using redirect: 'follow' is standard, but Apps Script responds with a redirect.
    const response = await fetch(appsScriptUrl, {
      redirect: 'follow'
    });
    const result = await response.json();
    
    // The google_apps_script.js returns { success: true, data: { Master_Users: [...], ... } }
    let count = 0;
    if (result.success && result.data && result.data.Master_Users) {
      count = result.data.Master_Users.length;
    }

    return new Response(JSON.stringify({
      metricName: "총 가입자 수",
      value: count
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to read data" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
