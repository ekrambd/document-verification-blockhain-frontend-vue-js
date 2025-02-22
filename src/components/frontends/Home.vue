<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">VerifyDoc</a>
            <div>
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <button type="button" class="btn btn-primary">Connect Wallet</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container">
        <div class="upload-container text-light">
            <h3>Upload Your Document for Verification</h3>
            <p class="my-3">Click the button below to upload your document file for verification.</p>
            <input type="file" id="file-upload" accept=".pdf" /><br/>
            <button class="btn-verify font-weight-bold bg-warning text-light">VERIFY DOCUMENT</button><br/>
            <!-- <button class="btn btn-verify bg-danger font-weight-bold text-light">DISCONNECT</button> -->
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>&copy; 2025 VerifyDoc | All Rights Reserved</p>
    </div>
  </div>  
</template>

<script setup>
 
</script>

<style scoped>

</style>