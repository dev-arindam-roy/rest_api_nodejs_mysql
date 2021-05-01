<template>
    <div id="members-temp">
        <div class="container">
            <div class="row mt-2">
                <div class="col-sm-6">
                    <h3>All Members ({{ memberCount }})</h3>
                </div>
                <div class="col-sm-6 text-right">
                    <router-link :to="{ name: 'add.member'}" class="btn btn-primary">Add Member</router-link>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-sm-12 scroll-table">
                    <table class="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>PHOTO</th>
                                <th>NAME</th>
                                <th>EMAIL ID</th>
                                <th>PHONE NO</th>
                                <th>SEX</th>
                                <th>COMPANY</th>
                                <th>SALARY</th>
                                <th>ADDRESS</th>
                                <th style="min-width: 150px;">#</th>
                            </tr>
                        </thead>
                        <tbody v-if="memberList.length > 0">
                            <tr v-for="(member, index) in memberList" :key="member.id">
                                <td>{{ index + 1 }}</td>
                                <td><img :src="member.profile_image" class="profile_image" /></td>
                                <td>{{ member.first_name }} {{ member.last_name }}</td>
                                <td>{{ member.email }}</td>
                                <td>{{ member.phone }}</td>
                                <td>{{ member.sex }}</td>
                                <td>{{ member.company_name }}</td>
                                <td>{{ member.salary }}</td>
                                <td>{{ member.address }}</td>
                                <td style="min-width: 150px;">
                                    <router-link class="btn btn-primary btn-sm mr-1" :to="{name: 'view.member', params: {hashid: member.hash_id}}">View</router-link>
                                    <button type="button" class="btn btn-danger btn-sm" @click="deleteMember(member)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../plugins/axios'
export default {
    name: 'membersList',
    props: {

    },
    data() {
        return {
            memberList: {},
            memberCount: 0
        }
    },
    methods: {
        async getAllMembers() {
            var _this = this
            _this.$store.commit('setPageLoading', true)
            axios.get('/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(process.env.VUE_APP_BROWSER_STORAGE_KEY)}`
                }
            }).then(response => {
                if (response.status === 200 && response.data.isSuccess === 1) {
                    _this.$store.commit('setPageLoading', false)

                    // remove self login user from list
                    _this.memberCount = response.data.content.user_count - 1
                    response.data.content.users.map ( (member, index) => {
                        if (member.email == _this.$store.state.authUser.email) {
                           response.data.content.users.splice(index, 1)
                        }
                    })
                    _this.memberList = response.data.content.users
                } else {
                    _this.$toast.error('Something went wrong!')
                }
            }).catch(error => {
                _this.$toast.error(error.response.data.error_msg)
            })
        },
        async deleteMember(mem) {
            var _this = this
            _this.$store.commit('setPageLoading', true)
            await axios({
                method: 'DELETE',
                url: '/users/delete',
                data: {
                    user_id: mem.id
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(process.env.VUE_APP_BROWSER_STORAGE_KEY)}`
                }
            })
            .then(function (response) {
                if (response.status === 200 && response.data.isSuccess === 1) {
                    let index = _this.memberList.indexOf(mem)
                    _this.memberList.splice(index, 1)
                    _this.memberCount--
                    _this.$store.commit('setPageLoading', false)
                }
            })
            .catch(function (error) {
                _this.$store.commit('setPageLoading', false)
                _this.$toast.error(error.response.data.error_msg)
            })
        }
    },
    mounted() {
        this.$store.commit('setPageLoading', false)
        this.getAllMembers()
    }
}
</script>

<style scoped>
.profile_image {
    width: 40px;
    height: 38px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.scroll-table {
    max-height: 350px;
    max-width: 100%;
    overflow: auto;
}
</style>
