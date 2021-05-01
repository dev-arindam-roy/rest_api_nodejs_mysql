<template>
    <div id="view-mem-temp">
        <div class="container">
            <div class="row mt-3">
                <div class="col-sm-6">
                    <h3>Member Details</h3>
                </div>
                <div class="col-sm-6 text-right">
                    <button type="button" class="btn btn-primary" @click="backToMemberList()">Back</button>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-sm-6">
                    <div class="mt-2 mb-2">
                        <img :src="member.profile_image" class="profile_image" />
                    </div>
                    <table class="table table-bordered">
                        <tr>
                            <th>First Name:</th>
                            <td>{{ member.first_name }}</td>
                        </tr>
                        <tr>
                            <th>Last Name:</th>
                            <td>{{ member.last_name }}</td>
                        </tr>
                        <tr>
                            <th>Email Id:</th>
                            <td>{{ member.email }}</td>
                        </tr>
                        <tr>
                            <th>Phone No:</th>
                            <td>{{ member.phone }}</td>
                        </tr>
                        <tr>
                            <th>Sex:</th>
                            <td>{{ member.sex }}</td>
                        </tr>
                        <tr>
                            <th>Date of Birth:</th>
                            <td>{{ member.dob }}</td>
                        </tr>
                        <tr>
                            <th>City:</th>
                            <td>{{ member.city }}</td>
                        </tr>
                        <tr>
                            <th>Pincode:</th>
                            <td>{{ member.pincode }}</td>
                        </tr>
                        <tr>
                            <th>State:</th>
                            <td>{{ member.state }}</td>
                        </tr>
                        <tr>
                            <th>Country:</th>
                            <td>{{ member.country }}</td>
                        </tr>
                        <tr>
                            <th>Address:</th>
                            <td>{{ member.address }}</td>
                        </tr>
                        <tr>
                            <th>Company Name:</th>
                            <td>{{ member.company_name }}</td>
                        </tr>
                        <tr>
                            <th>Salary:</th>
                            <td>{{ member.salary }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../../plugins/axios'
export default {
    name: 'memberInfo',
    props: {

    },
    data() {
        return {
            member: {}
        }
    },
    methods: {
        async getMember(id) {
            var _this = this
            _this.$store.commit('setPageLoading', true)
            axios.get(`/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(process.env.VUE_APP_BROWSER_STORAGE_KEY)}`
                }
            }).then(response => {
                if (response.status === 200 && response.data.isSuccess === 1) {
                    _this.member = response.data.content.user
                    _this.$store.commit('setPageLoading', false)
                    
                } else {
                    _this.$toast.error('Something went wrong!')
                    _this.$router.push({ name: 'members' })
                }
            }).catch(error => {
                _this.$toast.error(error.response.data.error_msg)
                _this.$router.push({ name: 'members' })
            })
        },
        backToMemberList() {
            this.$router.go(-1)
        }
    },
    mounted() {
        this.$store.commit('setPageLoading', false)
        this.getMember(this.$route.params.hashid)
    }
}
</script>

<style scoped>
.profile_image {
    width: 100px;
    height: 96px;
    border:2px solid #ddd;
    border-radius: 5px;
}
</style>
