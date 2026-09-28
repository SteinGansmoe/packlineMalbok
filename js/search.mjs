import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import { publicKey, projectId } from "./user/utils/constants.mjs";
import { renderCarList } from "./renderCars.mjs";

const supabase = createClient(projectId, publicKey);

export function setupSearch(inputElement, carListElement) {
  let searchTimeout;

  inputElement.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      const query = inputElement.value.trim().toLowerCase();

      if (!query) {
        carListElement.innerHTML = "";
        return;
      }

      const searchTerms = query
        .split(/\s+/)
        .filter(Boolean);

      const { data, error } = await supabase
        .from("cars")
        .select("*");

      if (error) {
        carListElement.innerHTML = `
          <p class="text-red-500">
            Feil ved søk: ${error.message}
          </p>
        `;
        return;
      }

      const filteredCars = data.filter((car) => {
        const searchableText = `
          ${car.id}
          ${car.make || ""}
          ${car.model || ""}
          ${car.year || ""}
          ${car.roofbox || ""}
          ${car.takfeste || ""}
          ${car.takstativ || ""}
        `
          .toLowerCase()
          .replace(/\s+/g, " ");

        return searchTerms.every((term) =>
          searchableText.includes(term)
        );
      });

      const session = (await supabase.auth.getSession()).data.session;

      renderCarList(filteredCars, session, carListElement);
    }, 400);
  });
}