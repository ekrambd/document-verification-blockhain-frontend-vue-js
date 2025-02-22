<template>
  <div class="container-fluid" id="container-wrapper">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Add Document</h1>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/admin/dashboard">Dashboard</router-link></li>
        <li class="breadcrumb-item">Forms</li>
        <li class="breadcrumb-item active" aria-current="page">Add Document</li>
      </ol>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="card mb-4">
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Add Document</h6>
          </div>
          <div class="card-body">
            <form @submit.prevent="addDocument" enctype="multipart/form-data">

              <div class="form-group">
                <label for="title">Title</label>
                <input type="text" v-model="title" class="form-control" id="title"
                       placeholder="Title" required />
                <small v-if="errors.title" class="text-danger">{{ errors.title[0] }}</small>
              </div>

              <div class="form-group">
                <label for="file">Document File</label>
                <input type="file" @change="fileUpload" class="form-control" accept=".pdf" id="file" required />
                <small v-if="errors.file" class="text-danger">{{ errors.file[0] }}</small>
              </div>

              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" v-model="description" rows="5" cols="40" class="form-control"
                          required placeholder="Description"></textarea>
                <small v-if="errors.description" class="text-danger">{{ errors.description[0] }}</small>
              </div>

              <div class="form-group">
                <div v-if="status">
                  <button type="button" @click="publishDocument" :disabled="loading" class="btn btn-primary btn-block">
                    {{ loading ? "Loading..." : "Publish" }}
                  </button>
                </div>
                <div v-else>
                  <button :disabled="loading" type="submit" class="btn btn-success btn-block">
                    {{ loading ? "Loading..." : "Submit" }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from 'vuex';
import { useToast } from 'vue-toast-notification';
import axios from "axios";
import { BrowserProvider } from 'ethers';
import { useAppKitProvider } from '@reown/appkit/vue'; 
import { ethers } from "ethers";

const title = ref("");
const description = ref("");
const file = ref(null);
const loading = ref(false);
const errors = ref({}); 
const status = ref(false);
const ipfs_hash = ref('');
const document_id = ref('');
const store = useStore();
const token = computed(() => store.getters.getToken);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Toast notifications
const toast = useToast();

// File upload handler
let fileUpload = (event) => {
    let selectedFile = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      file.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
};

// Reset form fields
const resetForm = () => {
  title.value = "";
  description.value = "";
  file.value = null;
  document.getElementById("file").value = "";
};

// Add document method (on form submission)
const addDocument = async () => {
  try {
    loading.value = true;
    errors.value = {};

    const formData = new FormData();  // Create FormData instance
    formData.append("title", title.value);
    formData.append("description", description.value);
    formData.append("file", file.value);

    // Send the data to the API
    const response = await axios.post(`${API_BASE_URL}/api/v1/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token.value}`,
      },
    });

    console.log(response.data);
    if(response.status)
    {  
       status.value = true;
       ipfs_hash.value = response.data.ipfs_hash;
       document_id.value = response.data.document_id;
       toast.success("Document added successfully!", { position: "top-right", duration: 1000 });
       //resetForm();
    }
    

    // Reset form after successful submission
    

  } catch (error) {
    console.error("Error during transaction:", error);
    if (error.response && error.response.data && error.response.data.data) {
      errors.value = error.response.data.data;
    } else {
      toast.error(error.response.data.message, { position: "top-right" });
    }
  } finally {
    loading.value = false;
  }
};

let publishDocument = async () => {
    try {
        loading.value = true;

        const { walletProvider } = useAppKitProvider('eip155');
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

        const contractABI = [
            "function addDocument(string memory _title, string memory _description, bytes32 _documentHash) public",
            "event DocumentAdded(bytes32 indexed documentHash, string title, string description)"
        ];

        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const ipfsHashBytes32 = ethers.keccak256(ethers.toUtf8Bytes(ipfs_hash.value));

        const tx = await contract.addDocument(title.value, description.value, ipfsHashBytes32);
        console.log(tx.hash);

        axios.post(`${API_BASE_URL}/api/v1/save-document-log/`, {
          document_id: document_id.value,
          ipfs_hash: ipfs_hash.value,
          transaction_hash: tx.hash,
          action: 'Add',
        }, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token.value}`,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          console.log(response.data);
          toast.success(response.data.message, { position: 'top-right', duration: 1000 });
        })
        .catch((error) => {
          console.error('API Error:', error);
          if (error.response && error.response.data && error.response.data.data) {
            errors.value = error.response.data.data; // Store validation errors
          } else {
            toast.error("Something went wrong!", { position: 'top-right' });
          }
        });
        toast.success("Successfully Published", { position: "top-right" });

    } catch (error) {
        if (error.code === 'CALL_EXCEPTION' && error.reason) {
            toast.error(`${error.reason}`, { position: "top-right" });
        } else {
            console.log(error);
            toast.error("Error publishing document", { position: "top-right" });
        }
    } finally {
        loading.value = false;
    }
};


</script>

<style scoped>
/* You can add specific styles for your component here */
</style>
