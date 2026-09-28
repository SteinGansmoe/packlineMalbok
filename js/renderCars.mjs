import { projectId } from "./user/utils/constants.mjs";
import { setupCopyButtons } from "./user/utils/copyHandler.mjs";
import { setupEditButtons } from "./user/utils/editHandler.mjs";

export function renderCarList(data, session, container) {
  container.innerHTML = "";

  data.forEach((car) => {
    const item = document.createElement("div");
    item.className =
      "relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md";

    const makeSlug = car.make.toLowerCase().replaceAll(" ", "-");
    const modelSlug = car.model.toLowerCase().replaceAll(" ", "-");
    const fileName = `${makeSlug}-${modelSlug}.jpg`;
    const imageUrl = `${projectId}/storage/v1/object/public/car-images/${fileName}`;

    const infoText = `
${car.make}
${car.model}
${car.roofbox || "N/A"}
${car.takstativ || "N/A"} 
${car.cc || "N/A"} / ${car.cb || "N/A"}
Front: ${car.front || "N/A"}
Bak: ${car.bak || "N/A"}
Mal nummer: ${car.id}`.trim();

const updatedDate = car.updated_at
  ? new Date(car.updated_at).toLocaleDateString("nb-NO")
  : null;


// <p class="text-sm text-gray-700">Takfeste: ${car.takfeste || "N/A"}</p>
item.innerHTML = `
  <div class="flex items-start justify-between gap-6">
    <div class="min-w-0 flex-1">
      <a
        href="measurements.html?id=${car.id}"
        class="block"
      >
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            ${car.make} ${car.model}
            <span class="font-normal text-gray-500">
              (${car.year || ""})
            </span>
          </h3>

          <p class="mt-1 text-xs text-gray-500">
            Mal nummer: ${car.id}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <p class="text-xs uppercase tracking-wide text-gray-400">
              Takboks
            </p>
            <p class="font-medium text-gray-900">
              ${car.roofbox || "N/A"}
            </p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wide text-gray-400">
              Takstativ
            </p>
            <p class="font-medium text-gray-900">
              ${car.takstativ || "N/A"}
            </p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wide text-gray-400">
              CC
            </p>
            <p class="font-medium text-gray-900">
              ${car.cc || "N/A"}
            </p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wide text-gray-400">
              CB
            </p>
            <p class="font-medium text-gray-900">
              ${car.cb || "N/A"}
            </p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wide text-gray-400">
              Front
            </p>
            <p class="font-medium text-gray-900">
              ${car.front || "N/A"}
            </p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wide text-gray-400">
              Bak
            </p>
            <p class="font-medium text-gray-900">
              ${car.bak || "N/A"}
            </p>
          </div>

          <div class="col-span-2">
            <p class="text-xs uppercase tracking-wide text-gray-400">
              Høyde med boks
            </p>
            <p class="font-medium text-gray-900">
              ${car.height_with_box ? `${car.height_with_box} cm` : "N/A"}
            </p>
          </div>
        </div>
      </a>

      ${
        car.note
          ? `
            <div class="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div class="flex gap-3">
                <i class="fa-solid fa-triangle-exclamation mt-0.5 text-amber-500"></i>

                <div>
                  <p class="text-sm font-semibold text-amber-900">
                    Viktig informasjon
                  </p>

                  <p class="mt-1 text-sm text-amber-800">
                    ${car.note}
                  </p>
                </div>
              </div>
            </div>
          `
          : ""
      }

      <div class="mt-5">
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            class="paint-toggle accent-green-600"
          />
          Lakkeres?
        </label>

        <input
          type="text"
          placeholder="Farge + fargekode"
          class="paint-code hidden mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      ${
        updatedDate
          ? `
            <p class="mt-4 text-xs text-gray-500">
              Sist oppdatert: ${updatedDate}
            </p>
          `
          : ""
      }

      ${
        session
          ? `
            <div class="mt-4 flex gap-4 border-t border-gray-100 pt-4">
              <button
                class="edit-btn text-sm font-medium text-amber-600 hover:text-amber-700"
                data-id="${car.id}"
              >
                Rediger
              </button>

              <button
                class="delete-btn text-sm font-medium text-red-600 hover:text-red-700"
                data-id="${car.id}"
              >
                Slett
              </button>
            </div>
          `
          : ""
      }
    </div>

    <div class="flex w-44 shrink-0 flex-col items-end">
      <button
        class="copy-btn rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        data-info="${infoText.replaceAll('"', "&quot;")}"
      >
        Kopier
      </button>

      <img
        src="${imageUrl}"
        alt="Bilde av ${car.make} ${car.model}"
        class="mt-12 w-40 object-contain opacity-90"
        onerror="this.style.display='none';"
      />
    </div>
  </div>
`;
    

  

    

    container.appendChild(item);

    item.querySelector(".paint-toggle").addEventListener("change", (e) => {
      const input = item.querySelector(".paint-code");
      input.classList.toggle("hidden", !e.target.checked);
    });
  });

  setupEditButtons(); // Assuming this handles both edit & delete buttons
  setupCopyButtons();
}
