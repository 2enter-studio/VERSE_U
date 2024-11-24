<script>
  import { enhance } from '$app/forms';
  const key = '6LdjwYcqAAAAAOaUuaAZw6aIJ4pdgHY-erFWT7cC';
</script>
    
<svelte:head>
  <script src="https://www.google.com/recaptcha/api.js?render={key}" async defer></script>
</svelte:head>
    
<form action="?" method="POST">
  <div class="g-recaptcha" data-sitekey={key}></div>
  <br />
  <input type="submit" value="Submit" />
</form>
