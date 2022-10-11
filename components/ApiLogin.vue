<template>
  <div class="api-login-wrapper">
    <span>Api Login Data</span>

    <label for="api-client-id">Client Id</label>
    <input id="api-client-id" />
    <label for="api-secret-key">Client Secret Key</label>
    <input type="password" id="api-secret-key" />
    <button id="api-submit">Submit</button>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss">
.active {
  cursor: pointer;
  background: greenyellow;
}
.api-login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: 3px solid black;
  min-width: 120px;
  min-height: 120px;
  transition: all 0.5s ease-out;

  label {
    font-size: 10px;
    margin-left: 15px;
    margin-top: 7px;
    margin-bottom: -7px;
    text-align: left;
    width: 100%;
  }
  input {
    height: 28px;
  }
  input,
  button {
    outline: 3px solid black;
    background-color: white;
    color: black;
    padding: 4px 6px;
    margin: 10px;
  }
  button:hover {
    background-color: black;
    color: white;
  }
}
</style>
