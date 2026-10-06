const socket = io();
const lists = {
all: document.getElementById("services-list"),
available: document.getElementById("available-list"),
unavailable: document.getElementById("unavailable-list"),
};
const sections = [
{ list: lists.all, count: "services-count", empty: "services-empty" },
{ list: lists.available, count: "available-count", empty: "available-empty" },
{ list: lists.unavailable, count: "unavailable-count", empty: "unavailable-empty" },
].filter((section) => section.list);
const statusBadge = document.getElementById("live-status");
const toast = document.getElementById("toast");
const escapeHTML = (value) =>
String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
}[char]));
const formatPrice = (price) => `$${Number(price).toLocaleString("es-AR")}`;
const buildCard = (service) => {
const wrapper = document.createElement("div");
wrapper.innerHTML = `
    <article class="card" data-id="${escapeHTML(service.id)}">
    <header class="card-header">
        <h3>${escapeHTML(service.name)}</h3>
        <span class="badge ${service.available ? "badge-ok" : "badge-off"}">${
        service.available ? "Disponible" : "No disponible"
        }</span>
    </header>
    <p class="description">${escapeHTML(service.description)}</p>
    <ul class="meta">
        <li><span>Duración</span> ${escapeHTML(service.duration)} min</li>
        <li><span>Precio</span> ${escapeHTML(formatPrice(service.price))}</li>
        <li><span>Categoría</span> ${escapeHTML(service.category)}</li>
    </ul>
    </article>`;
return wrapper.querySelector(".card");
};
const findCard = (list, id) =>
[...list.children].find((card) => card.dataset.id === id);
const upsertCard = (list, service) => {
const card = buildCard(service);
const existing = findCard(list, service.id);
if (existing) existing.replaceWith(card);
else list.appendChild(card);
};

const removeCard = (list, id) => {
const existing = findCard(list, id);
if (existing) existing.remove();
};
const refreshSections = () => {
sections.forEach(({ list, count, empty }) => {
    const total = list.children.length;
    document.getElementById(count).textContent = total;
    document.getElementById(empty).classList.toggle("is-hidden", total > 0);
});
};
let toastTimer;
const showToast = (message) => {
if (!toast) return;
toast.textContent = message;
toast.classList.add("is-visible");
clearTimeout(toastTimer);
toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
};
const placeService = (service) => {
if (lists.all) upsertCard(lists.all, service);
if (lists.available && lists.unavailable) {
    const target = service.available ? lists.available : lists.unavailable;
    const other = service.available ? lists.unavailable : lists.available;
    removeCard(other, service.id);
    upsertCard(target, service);
}

refreshSections();
};
socket.on("connect", () => {
statusBadge.textContent = "En vivo";
statusBadge.classList.add("is-online");
});
socket.on("disconnect", () => {
statusBadge.textContent = "Desconectado";
statusBadge.classList.remove("is-online");
});
socket.on("service:created", (service) => {
placeService(service);
showToast(`Nuevo servicio: ${service.name}`);
});
socket.on("service:updated", (service) => {
placeService(service);
showToast(`Servicio actualizado: ${service.name}`);
});
socket.on("service:deleted", ({ id }) => {
sections.forEach(({ list }) => removeCard(list, id));
refreshSections();
showToast("Se eliminó un servicio");
});