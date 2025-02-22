import { createAppKit } from "@reown/appkit/vue";
import { polygon } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { useAppKit, useAppKitAccount } from "@reown/appkit/vue";
import { useDisconnect } from "@reown/appkit/vue";

export default {
  install(app) {
    // Metadata configuration
    const metadata = {
      name: "TokenX Presale",
      description: "TokenX Presale Description",
      url: "http://127.0.0.1:8000",
      icons: ["https://avatars.githubusercontent.com/u/179229932"],
    };

    const projectId = "ffe3c0739186289ced23ef6d89ed22f4";
    const networks = [polygon];
    
    // Create Wagmi Adapter and AppKit modal
    const wagmiAdapter = new WagmiAdapter({ networks, projectId });
    createAppKit({ adapters: [wagmiAdapter], networks, projectId, metadata });

    // Initialize AppKit and Account
    const { open } = useAppKit();
    const accountData = useAppKitAccount();
    const { disconnect } = useDisconnect();


    // Define methods to make available globally
    app.config.globalProperties.$wallet = {
      // Reactive connection state
      get isConnected() {
        return accountData.value?.isConnected || false;
      },
      get accountAddress() {
        return accountData.value?.address || "";
      },

      // Open the wallet modal
      openModal() {
        open();
      },

      // Handle wallet signature and login
  

      // Disconnect the wallet
      disconnectWallet() {
        disconnect();
      },
      
      // Check for logout on mounted (you can call this in your component)
      checkLogout() {
        const checkLogout = localStorage.getItem('logout');
        if (checkLogout === 'true') {
          this.disconnectWallet();
          localStorage.removeItem('logout');
        }
      },
    };
  },
};
