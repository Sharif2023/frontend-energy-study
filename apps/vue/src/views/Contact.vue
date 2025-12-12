<template>
  <div class="page">
    <div class="contact-page">
      <h1>Contact</h1>
      <form class="contact-form" @submit.prevent="handleSubmit">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            v-model="formData.name"
            :class="{ error: errors.name }"
          />
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            v-model="formData.email"
            :class="{ error: errors.email }"
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <div>
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            v-model="formData.message"
            :class="{ error: errors.message }"
          />
          <div v-if="errors.message" class="error-message">{{ errors.message }}</div>
        </div>

        <button type="submit">Send Message</button>
        <div v-if="submitted" class="success-message">Message sent successfully!</div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'Contact',
  setup() {
    const formData = reactive({
      name: '',
      email: '',
      message: ''
    })
    const errors = ref({})
    const submitted = ref(false)

    const validate = () => {
      const newErrors = {}

      if (!formData.name.trim()) {
        newErrors.name = 'Name is required'
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }

      if (!formData.message.trim()) {
        newErrors.message = 'Message is required'
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
      if (validate()) {
        console.log('Form submitted:', formData)
        submitted.value = true
        Object.assign(formData, { name: '', email: '', message: '' })
        setTimeout(() => {
          submitted.value = false
        }, 5000)
      }
    }

    return {
      formData,
      errors,
      submitted,
      handleSubmit
    }
  }
}
</script>
