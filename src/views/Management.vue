<template>
  <div>
    <h1>People</h1>

    <div class="insert-people">
      <form @submit.prevent="!editMode ? savePerson() : updatePersonData()">
        <label for="dpi">DPI*</label>
        <input id="dpi" placeholder="Enter DPI" v-model="person.dpi" />
        <label for="nit">NIT</label>
        <input
          type="text"
          id="nit"
          placeholder="Enter NIT"
          v-model="person.nit"
        />
        <label for="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          placeholder="Enter First Name"
          v-model="person.firstName"
        />
        <label for="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          placeholder="Enter LastName"
          v-model="person.lastName"
        />
        <label for="address">Address:</label>
        <input
          type="text"
          id="address"
          placeholder="Enter address"
          v-model="person.address"
        />
        <label for="">Departamento:</label>
        <select @change="selectDepartamento" v-model="departamentoSeleccionado">
          <option disabled value="">Please select one</option>
          <option
            v-for="departamento in departamentos.data"
            :value="departamento.id"
            :key="departamento.id"
          >
            {{ departamento.nombre }}
          </option>
        </select>
        <label for="">Municipio:</label>
        <select @change="selectRegion" v-model="municipioSeleccionado">
          <option disabled value="">Please select one</option>

          <option
            v-for="municipio in municipiosDeDepartamento"
            :value="municipio.id"
            :key="municipio.id"
          >
            {{ municipio.nombre }}
          </option>
        </select>

        <button v-if="editMode" type="submit">Update person</button>
        <button v-if="!editMode" type="submit">Save person</button>
      </form>
    </div>
    <div class="show-people">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>DPI</th>
            <th>NIT</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>Municipio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in peopleData.data" :key="person.id">
            <td>{{ person.id }}</td>
            <td>{{ person.dpi }}</td>
            <td>{{ person.nit }}</td>
            <td>{{ person.nombre }}</td>
            <td>{{ person.Apellido }}</td>
            <td>{{ person.direccion }}</td>
            <td>{{ person.municipio }}</td>
            <td>
              <button @click="deletePerson(person.id)">Delete Person</button>
              <button @click="updatePerson(person)">Update Person</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted, reactive } from "vue";
import axiosInstance from "../api/api";

const departamentos = ref([]);
const municipios = ref([]);

const peopleData = ref([]);

const editMode = ref(false);
onMounted(() => {
  Promise.all([
    axiosInstance.get("/municipio"),
    axiosInstance.get("/departamento"),
    axiosInstance.get("/read"),
  ])
    .then(([municipiosResponse, departamentosResponse, peopleResponse]) => {
      departamentos.value = departamentosResponse.data;
      municipios.value = municipiosResponse.data;
      peopleData.value = peopleResponse.data;
    })
    .catch((error) => {
      console.error(error);
    });
});

const person = reactive({
  dpi: "",
  nit: "",
  firstName: "",
  lastName: "",
  municipioId: "",
  address: "",
});

const departamentoSeleccionado = ref([]);
const municipiosDeDepartamento = ref([]);
const municipioSeleccionado = ref([]);
//Filter Municipios by Departamento Logic
const selectDepartamento = () => {
  municipiosDeDepartamento.value = municipios.value.data.filter(
    (municipio) => municipio.departamento_id === departamentoSeleccionado.value
  );
  console.log(municipiosDeDepartamento.value);
};

const selectRegion = () => {
  console.log(municipioSeleccionado.value);
};
// POST METHOD
const savePerson = async () => {
  console.log(person);
  try {
    const formDataPerson = new FormData();
    formDataPerson.append("dpi", person.dpi);
    formDataPerson.append("nit", person.nit);
    formDataPerson.append("nombre", person.firstName);
    formDataPerson.append("apellido", person.lastName);
    formDataPerson.append("direccion", person.address);
    formDataPerson.append(
      "municipio_id",
      municipioSeleccionado.value.toString()
    );

    const postResponse = await axiosInstance.post("/insert", formDataPerson, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    //Update table
    peopleData.value.data.push(postResponse.data.data);
    // Clear fields
    person.dpi = "";
    person.nit = "";
    person.address = "";
    person.firstName = "";
    person.lastName = "";
    departamentoSeleccionado.value = "";
    municipioSeleccionado.value = "";

    window.alert("The person was saved correctly!");
  } catch (error) {
    console.error(error);
    window.alert(
      "Sorry, the person wasn't saved correctly! Check if all required fields are filled"
    );
  }
};

//DELETE Method
const deletePerson = async (personId) => {
  console.log(personId);
  try {
    const formDataPerson = new FormData();
    formDataPerson.append("id", parseInt(personId));
    const deleteResponse = await axiosInstance.delete("/delete", {
      data: {
        id: parseInt(personId),
      },
    });
    console.log(deleteResponse.data);
    peopleData.value.data = peopleData.value.data.filter(
      (person) => person.id !== personId
    );
  } catch (error) {
    console.log(error);
    window.alert("Sorry, the person wasn't deleted correctly. Try again.");
  }
};

// UPDATE Person Function
const updatePerson = (personToUpdate) => {
  editMode.value = true;
  person.id = personToUpdate.id;
  person.nit = personToUpdate.nit;
  person.dpi = personToUpdate.dpi;
  person.firstName = personToUpdate.nombre;
  person.lastName = personToUpdate.apellido;
  person.address = personToUpdate.direccion;
  console.log(personToUpdate.municipio_id);
  //   departamentoSeleccionado
};

const updatePersonData = () => {
  try {
    console.log(person.id);
    const formEditPerson = new FormData();
    formEditPerson.append("id", parseInt(person.id));
    formEditPerson.append("dpi", person.dpi);
    formEditPerson.append("nit", person.nit);
    formEditPerson.append("nombre", person.firstName);
    formEditPerson.append("apellido", person.lastName);
    formEditPerson.append("direccion", person.address);
    formEditPerson.append("municipio_id", 5);
    const putResponse = axiosInstance.put("/update", formEditPerson, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Clear fields
    person.dpi = "";
    person.nit = "";
    person.address = "";
    person.firstName = "";
    person.lastName = "";
    departamentoSeleccionado.value = "";
    municipioSeleccionado.value = "";
  } catch (error) {
    console.log(error);
    window.alert("Sorry, the person wasn't updated successfully :(");
  }
  editMode.value = false;
};
</script>