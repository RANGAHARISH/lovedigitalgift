/**
 * End-to-end smoke test + demo seed.
 *
 * Starts from an empty database, creates the demo account, publishes two gifts,
 * and exercises every public route plus the gift/upload/share APIs.
 *
 *   node scripts/verify.mjs
 */

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
let cookie = "";
const results = [];

function check(name, ok, detail = "") {
  results.push({ name, ok: Boolean(ok), detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${name}${detail ? `  (${detail})` : ""}`);
}

async function request(path, options = {}) {
  const headers = { ...(options.headers ?? {}) };
  if (cookie) headers.cookie = cookie;
  const response = await fetch(`${BASE}${path}`, { redirect: "follow", ...options, headers });
  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : response.headers.get("set-cookie")
        ? [response.headers.get("set-cookie")]
        : [];
  if (setCookies.length) {
    cookie = setCookies.map((value) => value.split(";")[0]).join("; ");
  }
  return response;
}

const text = (response) => response.text();
const json = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

// A 2x2 PNG so we do not depend on any fixture files.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC",
  "base64",
);

async function main() {
  console.log(`\nVerifying ${BASE}\n`);

  // ---- Public pages -------------------------------------------------------
  const home = await request("/");
  const homeHtml = await text(home);
  check("GET / returns 200", home.status === 200);
  check("homepage hero copy", homeHtml.includes("Share Love Beautifully") && homeHtml.includes("with a Digital Gift"));
  check("homepage stats", homeHtml.includes("Gift Templates") && homeHtml.includes("Happy Customers"));
  check("homepage how-it-works anchor", homeHtml.includes('id="how-it-works"'));
  check("homepage testimonials", homeHtml.includes("Loved by Many") && homeHtml.includes("Josh B."));
  check("homepage final CTA", homeHtml.includes("Ready to Create Something Unforgettable?"));

  const gallery = await request("/templates");
  const galleryHtml = await text(gallery);
  check("GET /templates returns 200", gallery.status === 200);
  check(
    "gallery shows 20+ templates",
    (galleryHtml.match(/Use template/g) ?? []).length >= 20,
    `${(galleryHtml.match(/Use template/g) ?? []).length} cards`,
  );

  const preview = await request("/templates/birthday-confetti");
  const previewHtml = await text(preview);
  check("template preview returns 200", preview.status === 200, "birthday-confetti");
  check("template preview renders live demo", previewHtml.includes("Birthday Confetti"));

  check("GET /login returns 200", (await request("/login")).status === 200);
  check("GET /signup returns 200", (await request("/signup")).status === 200);
  check("GET /terms returns 200", (await request("/terms")).status === 200);
  check("GET /privacy returns 200", (await request("/privacy")).status === 200);

  const robots = await text(await request("/robots.txt"));
  check("robots.txt lists the sitemap", robots.includes("sitemap.xml"));
  const sitemap = await text(await request("/sitemap.xml"));
  check("sitemap lists template pages", sitemap.includes("/templates/birthday-confetti"));

  const protectedResponse = await request("/dashboard", { redirect: "manual" });
  check(
    "anonymous /dashboard is redirected to login",
    [301, 302, 303, 307, 308].includes(protectedResponse.status),
    `status ${protectedResponse.status}`,
  );

  const missingGift = await request("/g/doesnotexist");
  check("unknown gift returns 404", missingGift.status === 404);

  // ---- Account ------------------------------------------------------------
  const credentials = { email: "demo@whishmydear.com", password: "demo12345", name: "Demo" };
  let signup = await request("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (signup.status === 409) {
    signup = await request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
  }
  check("signup or login works", signup.ok, `status ${signup.status}`);

  const badLogin = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: credentials.email, password: "wrong-password" }),
  });
  check("wrong password is rejected", badLogin.status === 401);

  // ---- Upload -------------------------------------------------------------
  const form = new FormData();
  form.append("file", new Blob([PNG], { type: "image/png" }), "memory.png");
  const upload = await request("/api/upload", { method: "POST", body: form });
  const uploadBody = await json(upload);
  check("image upload works", upload.status === 200 && Boolean(uploadBody?.url), uploadBody?.url ?? "");
  const media = await request(uploadBody?.url ?? "/api/media/missing.png");
  check("uploaded media is served", media.status === 200 && media.headers.get("content-type") === "image/png");

  // ---- Create + publish ---------------------------------------------------
  const create = await request("/api/gifts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateSlug: "birthday-confetti", title: "Sophie's 27th", recipientName: "Sophie" }),
  });
  const created = await json(create);
  const giftId = created?.gift?.id;
  check("create draft gift", create.status === 200 && Boolean(giftId), giftId ?? "");

  const content = {
    name: "Sophie",
    age: "27",
    message:
      "Another year of you being the brightest part of my world. I hope today feels as special as you make every ordinary day feel.",
    wish: "Happy birthday, my favourite person. Here's to more late-night talks, terrible dance moves and a year that finally deserves you.",
    from: "Alex",
    photos: uploadBody?.url ? [{ url: uploadBody.url, caption: "The best weekend" }] : [],
  };

  const patch = await request(`/api/gifts/${giftId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "published",
      theme_color: "#D7263D",
      content,
      music: { type: "library", url: "/music/romantic-piano.wav", name: "Romantic Piano" },
      qr_settings: { shape: "heart", fg: "#D7263D", bg: "#FFFFFF", logo: true },
    }),
  });
  const patched = await json(patch);
  check("publish gift", patch.status === 200 && patched?.gift?.status === "published");

  const giftPage = await request(`/g/${giftId}`);
  const giftHtml = await text(giftPage);
  check("published gift page is public", giftPage.status === 200);
  check("cover screen rendered", giftHtml.includes("Tap to open your gift") && giftHtml.includes("Sophie"));
  check("per-gift OG title", giftHtml.includes("A gift for Sophie"));

  // ---- Views --------------------------------------------------------------
  const view = await request(`/api/gifts/${giftId}/view`, { method: "POST" });
  check("view counter endpoint works", view.status === 200);
  const list = await json(await request("/api/gifts"));
  const listed = list?.gifts?.find((gift) => gift.id === giftId);
  check("view count incremented", listed?.views >= 1, `views=${listed?.views}`);

  // ---- Editor boot --------------------------------------------------------
  const editor = await request(`/create/birthday-confetti?gift=${giftId}`);
  const editorHtml = await text(editor);
  check("editor loads an existing gift", editor.status === 200 && editorHtml.includes("The basics"));

  // ---- Second gift for the dashboard --------------------------------------
  const create2 = await request("/api/gifts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateSlug: "anniversary-timeline", title: "Six years with Maya", recipientName: "Maya" }),
  });
  const gift2 = (await json(create2))?.gift?.id;
  await request(`/api/gifts/${gift2}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "published" }),
  });
  check("second gift created", Boolean(gift2), gift2 ?? "");

  const dashboard = await request("/dashboard");
  const dashboardHtml = await text(dashboard);
  check("dashboard renders gifts", dashboard.status === 200 && dashboardHtml.includes("Sophie's 27th"));

  // ---- Duplicate + delete -------------------------------------------------
  const duplicate = await request(`/api/gifts/${giftId}/duplicate`, { method: "POST" });
  const duplicateBody = await json(duplicate);
  const duplicateId = duplicateBody?.gift?.id;
  check("duplicate gift", duplicate.status === 200 && Boolean(duplicateId));
  const removal = await request(`/api/gifts/${duplicateId}`, { method: "DELETE" });
  check("delete gift", removal.status === 200);

  // ---- Summary ------------------------------------------------------------
  const failed = results.filter((result) => !result.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log("Failed checks:");
    for (const failure of failed) console.log(` - ${failure.name} ${failure.detail}`);
    process.exitCode = 1;
  } else {
    console.log(`\nDemo account: ${credentials.email} / ${credentials.password}`);
    console.log(`Published gift: ${BASE}/g/${giftId}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
