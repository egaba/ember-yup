import Controller from '@ember/controller';

export default Controller.extend({
  html: `
    <form class="" {{action "createUser" on="submit"}}>
      <div class="">
        <label for="username">username</label>
        <input id="username" type="text" value={{formData.username}} oninput={{action (mut formData.username) value="target.value"}}> *required
      </div>
      <div class="">
        <label for="age">age</label>
        <input id="age" type="text" value={{formData.age}} oninput={{action (mut formData.age) value="target.value"}}> *required
      </div>
      <div class="">
        <label for="email">email</label>
        <input id="email" type="text" value={{formData.email}} oninput={{action (mut formData.email) value="target.value"}}>
      </div>
      <button type="submit" name="button">create user</button>
      {{#each errorMessages as |error|}}
        <p style="color: red;">{{error}}</p>
      {{/each}}
    </form>
  `
});
