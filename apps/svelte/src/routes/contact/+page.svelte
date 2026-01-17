<script>
  let formData = {
    name: '',
    email: '',
    message: ''
  };
  
  let errors = {};
  let submitted = false;
  
  function validate() {
    errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  function handleSubmit() {
    if (validate()) {
      console.log('Form submitted:', formData);
      submitted = true;
      formData = { name: '', email: '', message: '' };
      setTimeout(() => {
        submitted = false;
      }, 5000);
    }
  }
</script>

<div class="page">
  <div class="contact-page">
    <h1>Contact</h1>
    <form class="contact-form" on:submit|preventDefault={handleSubmit}>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          bind:value={formData.name}
          class:error={errors.name}
        />
        {#if errors.name}
          <div class="error-message">{errors.name}</div>
        {/if}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          bind:value={formData.email}
          class:error={errors.email}
        />
        {#if errors.email}
          <div class="error-message">{errors.email}</div>
        {/if}
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          bind:value={formData.message}
          class:error={errors.message}
        />
        {#if errors.message}
          <div class="error-message">{errors.message}</div>
        {/if}
      </div>

      <button type="submit">Send Message</button>
      {#if submitted}
        <div class="success-message">Message sent successfully!</div>
      {/if}
    </form>
  </div>
</div>
