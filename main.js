let API = "http://localhost:8001/students";

// инпуты и кнопки для создания новых данных
let inpName = document.querySelector(".section__add_Name");
// console.log(inpDetails);
let inpSurname = document.querySelector(".section__add_Surname");
let inpNumber = document.querySelector(".section__add_Number");
let inpWeekKPI = document.querySelector(".section__add_KPI");
let inpMonthKPI = document.querySelector(".window__edit_KPI2")
let btnAdd = document.querySelector(".section__add_btn-add");
let accordion = document.querySelector(".accordion__header");

// тег для отображения данных в браузере
let sectionRead = document.getElementById("section__read");

// изменение продукта (инпуты)
let inpEditName = document.querySelector(".window__edit_Name");
let inpEditSurname = document.querySelector(".window__edit_Surname");
let inpEditNumber = document.querySelector(".window__edit_Number");
let inpEditPoints = document.querySelector(".window__edit_KPI2");
let btnEdit = document.querySelector(".window__edit_btn-save");
let btnCloseModal = document.querySelector(".window__edit_close");
let mainModal = document.querySelector(".main-modal");

console.log(inpEditPoints);
// инпут и переменная для поиска
let inpSearch = document.querySelector(".search-txt");
let searchValue = inpSearch.value;

// paginate
let prevBtn = document.querySelector("#prev-btn");
let nextBtn = document.querySelector("#next-btn");
let currentPage = 1;
let limit = 4;

// filter
let form = document.querySelector("form");
let category = "all";

// !=========== КОДОВОЕ СЛОВО ==========
let section_add = document.querySelector(".section__add");
let clickAdmin = document.getElementById("open-admin");
let admin_panel_arr = document.getElementsByClassName("admin-panel");
console.log(admin_panel_arr);
let code = "";
// console.log(section_add, clickAdmin);

function adminReturn() {
  if (code != "1") {
    setTimeout(() => {
      for (let i of admin_panel_arr) {
        i.style.display = "none";
      }
    }, 50);
    section_add.style.display = "none";
  } else {
    setTimeout(() => {
      for (let i of admin_panel_arr) {
        i.style.display = "block";
      }
    }, 50);
    section_add.style.display = "block";
  }
}

clickAdmin.addEventListener("click", () => {
  code = prompt("Введите кодовое слово: ");
  adminReturn();
});

// ! ============= Accordion start =========

accordion.addEventListener("click", () => {
  accordion.classList.toggle("active");
  let accordionBody = document.getElementById("accordion__body");
  if (accordion.classList.contains("active")) {
    accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
  } else {
    accordionBody.style.maxHeight = 0;
  }
});

// ? ========== ACCORDION END ==============


async function createProduct(obj) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  }).then((res) => res.json());
  readProducts();
}

btnAdd.addEventListener("click", () => {
  // проверка на заполненность полей
  // if (
  //   !inpDetails.value.trim() ||
  //   !inpQuantity.value.trim() ||
  //   !inpPrice.value.trim() ||
  //   !inpCategory.value.trim()
  // ) {
  //   alert("Заполните поля!");
  //   return;
  // }
  let obj = {
    name: inpName.value,
    surname: inpSurname.value,
    number: inpNumber.value,
    KPI: inpWeekKPI.value,
    KPI2: inpMonthKPI.value
  };
  createProduct(obj);
  inpDetails.value = "";
  inpPrice.value = "";
  inpQuantity.value = "";
  inpCategory.value = "";

});

// ? ============= CREATE END ===========
// ? =========== PAGINATION start =======

let countPage = 1
async function pageTotal() {
  let data = await fetch(`${API}`).then((res) => res.json());
  countPage = Math.ceil(data.length / limit);
  console.log(countPage);
}
pageTotal();
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return; 0

  currentPage--
  readProducts();
});

nextBtn.addEventListener("click", () => {
  console.log('fds');
  if (currentPage >= countPage) return;
  currentPage++
  readProducts();

})

//?=========== PAGINATION end ============

// ! ================= Read start ==============
async function readProducts() {
  let data = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=${limit}&${category === "all" ? "" : "category=" + category
    }`
  ).then((res) => res.json());
  sectionRead.innerHTML = "";
  console.log(data);
  data.forEach((student) => {
    // let productCard = document.createElement("div");
    sectionRead.innerHTML += `
    <tr>
        <td>${student.name}</td>
        <td>${student.surname}</td>
        <td>${student.number}</td>
        <td>${student.kpi}</td> 
        <td> <div class="admin-panel" id="admin">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1799/1799391.png"
          alt=""
          width="30"
          id=${student.id}
          class="read_del"
          onclick="deleteProduct(${student.id})"
        />
        <img  src="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png" alt="" width="30" onclick="handleEditBtn(${student.id})"/>
      </div> </td> 

      </tr>

    `;
  });


  adminReturn();
}
readProducts();
// ?  ======= READ END ============
// ! ===========
async function editProduct(id, editObj) {
  // if (
  //   !inpEditName.value.trim() ||
  //   !inpEditSurname.value.trim() ||
  //   !inpEditNumber.value.trim() ||
  //   !inpEditPoints.value.trim() ||

  // ) {
  //   alert("Заполните поле");
  //   return;
  // }
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(editObj)
  })
  readProducts()
}
let editId = "";
async function handleEditBtn(id) {
  mainModal.style.display = "block";
  let data = await fetch(`${API}/${id}`).then((res) => res.json());
  console.log(data.surname);
  inpEditName.value = data.name
  inpEditSurname.value = data.surname
  inpEditNumber.value = data.number
  inpEditKpi.value = data.kpi
  editId = data.id
  inpEditMonthKPI2 = data.KPI2
}

btnEdit.addEventListener("click", () => {
  let editObj = {
    name: inpEditName.value,
    surname: inpEditSurname.value,
    number: inpEditNumber.value,
    kpi: inpEditPoints.value,
  };
  // console.log(editObj);
  editProduct(editId, editObj);
  mainModal.style.display = "none";
})
// !============= DELETE START ===========

async function deleteProduct(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  readProducts();

}




