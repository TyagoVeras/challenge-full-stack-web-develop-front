<template>
  <div id="app">
    <div>
      <b-navbar type="dark" variant="dark">
        <b-container fluid>
          <div>
            <!-- Image and text -->
            <b-navbar variant="faded" type="dark">
              <b-navbar-brand href="#">
                <img
                  src="https://static.wixstatic.com/media/fd5189_123d841a3c6d4c01806f3d8c4d409306~mv2.png/v1/fill/w_461,h_163,al_c,q_85,usm_0.66_1.00_0.01/fd5189_123d841a3c6d4c01806f3d8c4d409306~mv2.webp"
                  class="d-inline-block align-top"
                  width="120"
                  alt="Obi.tec"
                />
              </b-navbar-brand>
            </b-navbar>
          </div>
        </b-container>
      </b-navbar>
    </div>

    <!-- 
      list of users
     -->

    <b-container fluid style="margin-top: 50px">
      <b-row>
        <div class="col-md-4">
          <b-alert show variant="secondary">{{ titleForm }}</b-alert>
          <b-form @submit.prevent="saveOrUpdate">
            <div class="row">
              <div class="col-md-6">
                <label for="user-name">Nome do usuario</label>
                <b-form-input v-model="user.name" id="user-name"></b-form-input>
              </div>
              <div class="col-md-6">
                <label for="user-email">Email do usuario</label>
                <b-form-input
                  type="email"
                  v-model="user.email"
                  id="user-email"
                ></b-form-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <label for="user-password">Senha do usuario</label>
                <b-form-input
                  v-model="user.password"
                  id="user-password"
                  type="password"
                ></b-form-input>
              </div>
              <div class="col-md-6">
                <label for="user-password-confirm">Confirmar senha</label>
                <b-form-input
                  v-model="user.password_confirm"
                  id="user-password-confirm"
                  type="password"
                ></b-form-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <label for="user-type">Nivel de acesso</label>

                <b-form-radio-group
                  v-model="user.isAdmin"
                  :options="options"
                  class="mb-4"
                  value-field="item"
                  text-field="name"
                  disabled-field="notEnabled"
                  id="user-type"
                ></b-form-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <b-button
                  type="reset"
                  @click="resetInputsUser"
                  variant="secondary"
                >
                  Limpar
                </b-button>
              </div>
              <div class="col-md-8">
                <b-button type="submit" variant="primary" class="col-md-12">{{
                  titleButton
                }}</b-button>
              </div>
            </div>
          </b-form>
        </div>
        <div class="col-md-8">
          <b-row>
            <b-col lg="6" class="my-1">
              <b-form-group
                label="Filtrar"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Pesquise por nome, uuid ou email"
                  ></b-form-input>

                  <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''"
                      >Limpar</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-table striped hover :items="users" :fields="fields" :filter="filter" >
            <template #cell(actions)="row">
              <b-button
                size="sm"
                @click="info(row.item, row.index, $event.target)"
                style="margin-right: 10px"
                variant="primary"
              >
                <b-icon icon="info-circle"></b-icon>
              </b-button>

              <b-button size="sm" @click="edit(row.item)" variant="warning">
                <b-icon icon="pencil"></b-icon>
              </b-button>
              <b-button
                size="sm"
                @click="remove(row.item, row.index, $event.target)"
                style="margin-left: 10px"
                variant="danger"
              >
                <b-icon icon="trash"></b-icon>
              </b-button>
            </template>
          </b-table>
        </div>
      </b-row>
    </b-container>
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      {{ infoModal.content }}
    </b-modal>
  </div>
</template>

<script>
import UserServices from "./modules/users/userServices";

export default {
  data() {
    return {
      titleForm: "Cadastrar usuario",
      titleButton: "Cadastrar",
      user: {
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirm: "",
        isAdmin: "",
      },
      filter: null,
      fields: [
        {key: "id", label: "UUID"},
        { key: "name", label: "Nome" },
        "email",
        { key: "actions", label: "Ações" },
      ],
      users: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      options: [
        { name: "Administrador", item: true },
        { name: "Usuario", item: false },
      ],
    };
  },
  computed: {
    checkFields() {
      const fieldsEmptys = Object.keys(this.user).find((key) => {
        if (this.user[key] === "") {
          return true;
        }
      });
      if (fieldsEmptys) {
        this.$swal(
          "Atenção",
          "Existem campos que devem ser preenchidos",
          "error"
        );
        return;
      }
      if (
        this.user.password != this.user.password_confirm ||
        this.user.password === ""
      ) {
        this.$swal("Senhas não conferem", "", "error");
        return;
      }
      return true;
    },
  },
  async mounted() {
    await this.listUsers();
  },
  methods: {
    async listUsers() {
      const users = await UserServices.list();
      this.users = users.data;
    },
    info(item, index, button) {
      this.infoModal.title = `Registro: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },

    resetInputsUser() {
      this.titleForm = "Cadastrar usuario";
      this.titleButton = "Cadastrar";
      this.user = {
        id: "",
        name: "",
        email: "",
        password: "",
        password_confirm: "",
        isAdmin: "",
      };
    },

    edit(user) {
      this.user = user;
      this.titleForm = "Editar usuario";
      this.titleButton = "Atualizar usuario";
    },

    async saveOrUpdate() {
      if (this.user.id === null) {
        if (!this.checkFields) return;
        try {
          await UserServices.create(this.user);
          this.resetInputsUser();
          this.listUsers();
          this.$swal("Usuario criado com sucesso", "", "success");
        } catch (e) {
          this.$swal("Erro ao criar usuario","error");
        }
      } else {
        try {
          await UserServices.update(this.user.id, this.user);
          this.resetInputsUser();
          this.listUsers();
          this.$swal("Usuario atualizado com sucesso", "", "success");
        } catch (e) {
          this.$swal("Erro ao atualizar usuario", `${e.message}`, "error");
        }
      }
    },

    async remove(user) {
      this.$swal({
        title: "Tem certeza que deseja excluir?",
        text: "Usuario será excluido permanentemente",
        icon: "warning",
        showCloseButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        showCancelButton: true,
      }).then(async (willDelete) => {
        console.log(willDelete);
        if (willDelete.isConfirmed) {
          try {
            await UserServices.delete(user.id);
            this.listUsers();
            this.$swal("Usuario excluido com sucesso", "", "success");
          } catch (e) {
            this.$swal("Erro ao excluir usuario", `${e.message}`, "error");
          }
        }
      });
    },
  },
};
</script>
