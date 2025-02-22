<template>
  <div class="container-fluid" id="container-wrapper">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">All Documents</h1>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/admin/dashboard">Dashboard</router-link></li> 
        <li class="breadcrumb-item">Forms</li>
        <li class="breadcrumb-item active" aria-current="page">Owner Logs</li>
      </ol>  
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card mb-4">
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">All Documents</h6>
          </div> 
          <div class="card-body">
              <input type="text" v-model="term" @input="searchTerm()" class="form-control my-2 col-12 col-md-3 float-right" placeholder="Search"/>  
            <div class="table-responsive">
              
              <!-- Check if data is loading or empty -->
              <table class="table table-bordered table-striped" v-if="!loading && laravelData.data.length > 0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>IPFS Hash</th>
                    <th>Action</th>   
                  </tr> 
                </thead>  
                <tbody>
                  <tr v-for="document in laravelData.data" :key="document.id">
                      <td>{{ document.title }}</td>  
                      <td>{{ document.ipfs_hash }}</td>
                    <td>
                      <router-link :to="`/admin/edit-document/${document.id}`" class="btn btn-primary btn-sm">
                        Edit
                      </router-link>
                      <button type="button"  class="btn btn-danger btn-sm mx-2 my-2">Delete</button>
                      <a href="#" class="btn btn-success btn-sm">View</a>
                    </td>   
                  </tr>
                </tbody>
              </table>

              <!-- Loading Spinner -->
              <div v-else-if="loading" class="text-center">
                <span class="spinner-border spinner-border-lg p-4" role="status" aria-hidden="true"></span>
              </div>

              <!-- No Data Found -->
              <div v-else class="text-center">
                <p>No Data Found</p>
              </div>
            </div>

            <!-- Pagination -->
            <Bootstrap5Pagination
              class="my-2"
              :data="pagination"
              :show-disabled="true"
              @pagination-change-page="fetchDocuments"
            />
          </div> 
        </div>
      </div>  
    </div> 
  </div>  
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import axios from "axios";
import { useStore } from 'vuex';

const laravelData = ref({ data: [] });
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  total: 0,
  per_page: 10
});


const loading = ref(true);

const store = useStore();
const token = computed(() => store.getters.getToken); 
const form = ref({ token: null });

const term = ref('');
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
watch(token, (newToken) => {
  form.value.token = newToken;
});

const tokenValue = token.value;

const fetchDocuments = async (page = 1) => {
  loading.value = true;
  try {
    await axios.get(`${API_BASE_URL}/api/v1/documents?page=${page}&term=${term.value}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenValue}`,
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log(response.data);
      laravelData.value = response.data;
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        next_page_url: response.data.next_page_url,
        prev_page_url: response.data.prev_page_url,
        total: response.data.total,
        per_page: response.data.per_page
      };
    }).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
  } finally {
    loading.value = false; // Set loading to false after fetching data
  }
};

let searchTerm = () => {
  fetchDocuments();
};

onMounted(() => {
  form.value.token = token.value;
  fetchDocuments();
});
</script>

<style scoped>
thead {
  text-align: center;
}

td {
  text-align: center;
}
</style>
