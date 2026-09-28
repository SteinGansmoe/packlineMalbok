import { supabase } from "./user/utils/supabaseClient.mjs";

const queueForm = document.getElementById("queue-form");
const queueList = document.getElementById("queue-list");
const emptyQueue = document.getElementById("empty-queue");
const queuedCount = document.getElementById("queued-count");
const inProgressCount = document.getElementById("in-progress-count");
const adminControls = document.getElementById("admin-queue-controls");
const toggleCompleted = document.getElementById("toggle-completed");
const completedSection = document.getElementById("completed-section");
const completedList = document.getElementById("completed-list");
const completedEmpty = document.getElementById("completed-empty");
const completedChevron = document.getElementById("completed-chevron");

const {
  data: { session },
} = await supabase.auth.getSession();


if (session) {
  adminControls?.classList.remove("hidden");
}

async function loadQueue() {
  const { data, error } = await supabase
    .from("box_queue")
    .select("*")
    .neq("status", "completed");

  if (error) {
    console.error("Kunne ikke hente kø:", error);
    return;
  }

  renderQueue(data);
}

function sortQueue(data) {
  const statusPriority = {
    in_progress: 0,
    queued: 1,
  };

  return data.sort((a, b) => {
    const statusDifference =
      statusPriority[a.status] - statusPriority[b.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return new Date(a.created_at) - new Date(b.created_at);
  });
}

function renderQueue(data) {
  queueList.innerHTML = "";

  const sortedData = sortQueue(data);

  queuedCount.textContent =
    data.filter((order) => order.status === "queued").length;

  inProgressCount.textContent =
    data.filter((order) => order.status === "in_progress").length;

  if (!sortedData.length) {
    emptyQueue.classList.remove("hidden");
    return;
  }

  emptyQueue.classList.add("hidden");

  sortedData.forEach((order) => {
    const row = document.createElement("tr");
    row.className = "transition hover:bg-gray-50";

    const createdDate = new Date(order.created_at).toLocaleDateString("nb-NO");

    row.innerHTML = `
      <td class="px-6 py-5 align-middle">
        <span class="font-semibold text-gray-900">
          ${order.order_number}
        </span>
      </td>

      <td class="px-6 py-5 align-middle text-gray-700">
        ${order.car_model}
      </td>

      <td class="px-6 py-5 align-middle">
        ${getStatusControl(order)}
      </td>

      <td class="px-6 py-5 align-middle text-sm text-gray-500">
        ${createdDate}
      </td>

      ${
  session
    ? `
      <td class="px-6 py-5 text-right">
        <button
          class="delete-order text-sm font-medium text-red-600 hover:text-red-800"
          data-id="${order.id}"
        >
          Slett
        </button>
      </td>
    `
    : ""
}
    `;

    queueList.appendChild(row);
  });
}

queueForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const orderNumber =
    document.getElementById("order-number").value.trim();

  const carModel =
    document.getElementById("car-model").value.trim();

  const { error } = await supabase
    .from("box_queue")
    .insert([
      {
        order_number: orderNumber,
        car_model: carModel,
      },
    ]);

  if (error) {
    console.error("Kunne ikke legge til ordre:", error);
    return;
  }

  queueForm.reset();
  loadQueue();
});

function getStatusBadge(status) {
  if (status === "in_progress") {
    return `
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
      >
        <span class="h-2 w-2 rounded-full bg-orange-500"></span>
        Under behandling
      </span>
    `;
  }

  return `
    <span
      class="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
    >
      <span class="h-2 w-2 rounded-full bg-blue-500"></span>
      I kø
    </span>
  `;

}

function getStatusControl(order) {
  if (!session) {
    return getStatusBadge(order.status);
  }

  return `
    <select
      class="status-select rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
      data-id="${order.id}"
    >
      <option value="queued" ${order.status === "queued" ? "selected" : ""}>
        I kø
      </option>

      <option value="in_progress" ${order.status === "in_progress" ? "selected" : ""}>
        Under behandling
      </option>

      <option value="completed">
        Ferdig
      </option>
    </select>
  `;
}

queueList.addEventListener("change", async (e) => {
  if (!e.target.classList.contains("status-select")) return;

  const id = e.target.dataset.id;
  const status = e.target.value;

  const updateData = {
    status,
  };

  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("box_queue")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Kunne ikke oppdatere status:", error);
    return;
  }

  loadQueue();
});

queueList.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-order")) return;

  const id = e.target.dataset.id;

  const confirmed = confirm(
    "Er du sikker på at du vil slette denne ordren?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("box_queue")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Kunne ikke slette ordre:", error);
    return;
  }

  loadQueue();
});

async function loadCompletedOrders() {
  const { data, error } = await supabase
    .from("box_queue")
    .select("*")
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Kunne ikke hente ferdige ordre:", error);
    return;
  }

  renderCompletedOrders(data);
}

function renderCompletedOrders(data) {
  completedList.innerHTML = "";

  if (!data.length) {
    completedEmpty.classList.remove("hidden");
    return;
  }

  completedEmpty.classList.add("hidden");

  data.forEach((order) => {
    const row = document.createElement("tr");

    const completedDate = order.completed_at
      ? new Date(order.completed_at).toLocaleDateString("nb-NO")
      : "-";

    row.innerHTML = `
      <td class="px-6 py-4 font-semibold text-gray-900">
        ${order.order_number}
      </td>

      <td class="px-6 py-4 text-gray-700">
        ${order.car_model}
      </td>

      <td class="px-6 py-4 text-sm text-gray-500">
        ${completedDate}
      </td>
    `;

    completedList.appendChild(row);
  });
}

let completedLoaded = false;

toggleCompleted?.addEventListener("click", async () => {
  const isHidden = completedSection.classList.contains("hidden");

  completedSection.classList.toggle("hidden");
  completedChevron?.classList.toggle("rotate-180", isHidden);

  if (isHidden && !completedLoaded) {
    await loadCompletedOrders();
    completedLoaded = true;
  }
});


loadQueue();