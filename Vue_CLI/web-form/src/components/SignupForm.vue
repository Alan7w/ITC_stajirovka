<template>
  <form @submit="submitForm">
    <label>Email: </label>
    <input type="email" required v-model="email" />

    <label>Password: </label>
    <input type="password" required v-model="password" />

    <label>Role: </label>
    <select v-model="role">
      <option value="developer">Web Developer</option>
      <option value="designer">Web Designer</option>
    </select>

    <label>Skills: </label>
    <input
      type="text"
      v-model="tempSkill"
      @keyup="addSkill"
      placeholder="press Ctrl(Command) to add skill"
    />
    <span
      v-for="skill in skills"
      :key="skill"
      class="skill"
      @click="removeSkill"
    >
      {{ skill }}
    </span>

    <div class="terms">
      <input type="checkbox" required v-model="terms" />
      <label>Accept term and conditions</label>
    </div>

    <div class="submit-div">
      <button class="submit-btn">Create Account</button>
    </div>

    <!-- <div>
      <input type="checkbox" value="asadbek" v-model="names" />
      <label>Asadbek</label>
    </div>

    <div>
      <input type="checkbox" value="humoyun" v-model="names" />
      <label>Humoyun</label>
    </div>

    <div>
      <input type="checkbox" value="aziz" v-model="names" />
      <label>Aziz</label>
    </div> -->
  </form>

  <p>Email: {{ email }}</p>
  <p>Password: {{ password }}</p>
  <p>Role: {{ role }}</p>
  <p>Term Accepted: {{ terms }}</p>
  <!-- <p>Names: {{ names }}</p> -->
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      role: "",
      terms: false,
      names: [],
      tempSkill: "",
      skills: [],
    };
  },
  methods: {
    addSkill(event) {
      if (event.key == "Meta" && this.tempSkill) {
        if (!this.skills.includes(this.tempSkill)) {
          this.skills.push(this.tempSkill);
        }
        this.tempSkill = "";
      }
    },

    removeSkill(event) {
      let clickedSkill = event.target.textContent;
      this.skills = this.skills.filter((skill) => skill != clickedSkill);
    },

    submitForm(event) {
        event.preventDefault()
        console.log('form submitted')
    }
  },
};
</script>

<style>
form {
  max-width: 420px;
  margin: 30px auto;
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}

label {
  color: #aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

input,
select {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}
:is(input, select):focus {
  outline: none;
}

input[type="checkbox"] {
  display: inline-block;
  width: 16px;
  margin: 0 10px 0 0;
  position: relative;
  top: 2px;
}

.skill {
  display: inline-block;
  margin: 20px 10px 0 0;
  padding: 6px 12px;
  background: #eee;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: bold;
  color: #777;
  cursor: pointer;
}

button {
  background: #0b6dff;
  border: 0;
  padding: 10px 20px;
  margin-top: 20px;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}

.submit-div {
    text-align: center;
}
</style>