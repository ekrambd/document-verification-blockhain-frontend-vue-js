<script setup>
import { onMounted, ref, watchEffect, getCurrentInstance } from 'vue';
import { useToast } from 'vue-toast-notification'; 
import { useAppKitProvider } from "@reown/appkit/vue";
import { BrowserProvider } from 'ethers';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const store = useStore();
const accountAddress = ref(''); // Reactive reference for wallet address
const toast = useToast();
const router = useRouter();
// Accessing the wallet instance via `getCurrentInstance`
const instance = getCurrentInstance();
const wallet = instance.appContext.config.globalProperties.$wallet;

// Ensure wallet is properly initialized and updates the address on mount
onMounted(() => {
  // If wallet is connected at mount, immediately assign the address
  if (wallet.isConnected) {
    accountAddress.value = wallet.accountAddress;
  }
  wallet.checkLogout();
});

// Watch for changes in wallet connection and address
watchEffect(() => {
  if (wallet.isConnected) {
    accountAddress.value = wallet.accountAddress;  // Update wallet address reactively
  } else {
    accountAddress.value = ''; // Clear the address if disconnected
  }
});

let signature = async() => {
  try {
    const { walletProvider } = useAppKitProvider('eip155');
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const signature = await signer?.signMessage('DocumentX Authorization');
    
    const response = await axios.post(`${API_BASE_URL}/api/v1/login`, {
      signature,
      wallet_address: wallet.accountAddress,
    });

    if (response.data.status) {
      const token = response.data.data.token;
      toast.success(response.data.message, { position: 'top-right', duration: 1000 });
      
      // Set token in Vuex and localStorage
      localStorage.setItem('token', token);
      store.dispatch('setToken', token);
      
      router.push({ name: 'AdminDashboard' }); 
    }
  } catch (error) {
    console.log(error);  
    toast.error(error.response?.data?.message || 'An error occurred', { position: 'top-right', duration: 1000 });
  }
};

</script>

<template>
  <div class="container-login">
    <div class="row justify-content-center">
      <div class="col-xl-6 col-lg-12 col-md-9">
        <div class="card shadow-sm my-5">
          <div class="card-body p-0">
            <div class="row">
              <div class="col-lg-12">
                <div class="login-form">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">DocumentX Admin Login</h1>
                  </div>

                  <div class="form-group">
                    <!-- Wallet Address Input -->
                    <input 
                      type="text" 
                      class="form-control" 
                      id="wallet_address" 
                      v-model="accountAddress"
                      aria-describedby="walletAddress"
                      placeholder="Wallet Address" 
                      readonly
                      required 
                    />
                  </div>

                  <div class="form-group">
                    <!-- Connect Wallet Button -->
                    <div v-if="wallet.isConnected">
                      <button type="button" class="btn btn-success btn-success btn-block font-weight-bold" @click="signature()">SIGN</button>
                      <button type="button" class="btn btn-danger btn-block font-weight-bold" @click="wallet.disconnectWallet()">DISCONNECT</button>
                    </div>  
                    <div v-else>
                      <button 
                        type="button" 
                        @click="wallet.openModal()" 
                        class="btn btn-warning btn-block font-weight-bold"
                      >
                        CONNECT WALLET
                      </button>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Login Content --> 
</template>

<style scoped>

</style>