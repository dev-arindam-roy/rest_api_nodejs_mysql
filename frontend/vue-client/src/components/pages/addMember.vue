<template>
    <div id="add-mem-temp">
        <div class="container">
            <div class="row mt-3">
                <div class="col-sm-6">
                    <h3>Add New Member</h3>
                </div>
                <div class="col-sm-6 text-right">
                    <button type="button" class="btn btn-primary" @click="backToMemberList()">Back</button>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-sm-12">
                    <form @submit.prevent="addMemberSubmit()" method="POST">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label>First Name:</label>
                                            <input type="text" class="form-control" v-model.trim="member.first_name" placeholder="First Name">
                                            <div class="text-danger" v-if="v$.member.first_name.$error">{{ v$.member.first_name.$errors[0].$message }}</div>
                                        </div>
                                        <div class="form-group">
                                            <label>Last Name:</label>
                                            <input type="text" class="form-control" v-model.trim="member.last_name" placeholder="Last Name">
                                            <div class="text-danger" v-if="v$.member.last_name.$error">{{ v$.member.last_name.$errors[0].$message }}</div>
                                        </div>
                                        <div class="form-group">
                                            <label>Email Id:</label>
                                            <input type="text" class="form-control" v-model.trim="member.email" placeholder="Email Address">
                                            <div class="text-danger" v-if="v$.member.email.$error">{{ v$.member.email.$errors[0].$message }}</div>
                                        </div>
                                        <div class="form-group">
                                            <label>Phone No:</label>
                                            <input type="text" class="form-control" v-model.trim="member.phone" placeholder="Phone No">
                                            <div class="text-danger" v-if="v$.member.phone.$error">{{ v$.member.phone.$errors[0].$message }}</div>
                                        </div>
                                        <div class="form-group">
                                            <label>Password:</label>
                                            <input type="password" class="form-control" v-model.trim="member.password" placeholder="Password">
                                            <div class="text-danger" v-if="v$.member.password.$error">{{ v$.member.password.$errors[0].$message }}</div>
                                        </div>
                                        <div class="form-group">
                                            <label>Confirm Password:</label>
                                            <input type="password" class="form-control" v-model.trim="member.confirm_password" placeholder="Confirm Password">
                                            <div class="text-danger" v-if="v$.member.confirm_password.$error">{{ v$.member.confirm_password.$errors[0].$message }}</div>
                                        </div>
                                        <div class="form-group">
                                            <label>Date of Birth:</label>
                                            <input type="date" class="form-control" v-model.trim="member.dob" placeholder="DOB">
                                        </div>
                                        <div class="form-group">
                                            <label>Sex:</label> <br/>
                                            <input type="radio" id="sex-male" v-model="member.sex" value="male"> Male
                                            <input type="radio" id="sex-female" v-model="member.sex" value="female"> Female
                                        </div>
                                        <div class="form-group">
                                            <label>Address:</label>
                                            <textarea class="form-control" v-model.trim="member.full_address" placeholder="Address"></textarea>
                                            <div class="text-danger" v-if="v$.member.full_address.$error">{{ v$.member.full_address.$errors[0].$message }}</div>
                                        </div>
                                        <div class="form-group">
                                            <label>City:</label>
                                            <input type="text" class="form-control" v-model.trim="member.city" placeholder="city">
                                        </div>
                                        <div class="form-group">
                                            <label>Pincode:</label>
                                            <input type="text" class="form-control" v-model.trim="member.pincode" placeholder="pincode">
                                        </div>
                                        <div class="form-group">
                                            <label>State:</label>
                                            <input type="text" class="form-control" v-model.trim="member.state" placeholder="State">
                                        </div>
                                        <div class="form-group">
                                            <label>Country:</label>
                                            <input type="text" class="form-control" v-model.trim="member.country" placeholder="Country">
                                        </div>
                                        <div class="form-group">
                                            <label>Company Name:</label>
                                            <input type="text" class="form-control" v-model.trim="member.company_name" placeholder="Company Name">
                                            <div class="text-danger" v-if="v$.member.company_name.$error">{{ v$.member.company_name.$errors[0].$message }}</div>
                                        </div>
                                        <div class="form-group">
                                            <label>Salary:</label>
                                            <input type="text" class="form-control" v-model.trim="member.salary" placeholder="Salary">
                                            <div class="text-danger" v-if="v$.member.salary.$error">{{ v$.member.salary.$errors[0].$message }}</div>
                                        </div>
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary mr-2">Create</button>
                                            <button type="button" class="btn btn-danger" @click="resetAll()">Reset</button>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group">
                                            <label>Photo:</label>
                                            <input type="file" ref="profileImage" accept="image/*" v-on:change="handleProfileImage($event)">
                                            <div class="text-danger" v-if="!isProfileImageExtensionValid">Invalid image extension</div>
                                            <div class="text-danger" v-if="!isProfileImageSizeValid">Image size too large</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from '../../plugins/axios'

import regex from '../../utils/regex'
import imageUploadValidation from '../../utils/imageValidation'
import customHelper from '../../utils/helper'

import useVuelidate from '@vuelidate/core'
import { required, email, minLength, maxLength, alpha, numeric, sameAs, helpers } from '@vuelidate/validators'


const validPassword = (value) => regex.regexPassword.test(value)

export default {
    setup () {
        return { v$: useVuelidate() }
    },
    name: 'addNewMember',
    props: {

    },
    data() {
        return {
            member: {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                sex: '',
                password: '',
                confirm_password: '',
                dob: '',
                full_address: '',
                city: '',
                pincode: '',
                state: '',
                country: '',
                company_name: '',
                salary: '',
                profile_image: ''
            },
            isProfileImageExtensionValid: true,
            isProfileImageSizeValid: true
        }
    },
    validations() {
        return {
            member: {
                first_name: {
                    required: helpers.withMessage('Please enter first name', required),
                    alpha: helpers.withMessage('Please enter valid first name', alpha),
                    minLength: minLength(3)
                },
                last_name: {
                    required: helpers.withMessage('Please enter last name', required),
                    alpha: helpers.withMessage('Please enter valid last name', alpha),
                    minLength: minLength(3)
                },
                email: { 
                    required: helpers.withMessage('Please enter email address', required),
                    email: helpers.withMessage('Please enter an valid email address', email)
                },
                phone: { 
                    required: helpers.withMessage('Please enter phone number', required),
                    numeric: helpers.withMessage('Please enter valid phone number', numeric),
                    minLength: minLength(10),
                    maxLength: maxLength(12),
                },
                password: { 
                    required: helpers.withMessage('Please enter password', required),
                    validPassword: helpers.withMessage('Please enter a strong password', validPassword),
                },
                confirm_password: { 
                    required: helpers.withMessage('Please enter confirm password', required),
                    sameAs: helpers.withMessage('Confirm password not match with password', sameAs(this.member.password))
                },
                full_address: {
                    required: helpers.withMessage('Please enter address', required)
                },
                company_name: {
                    required: helpers.withMessage('Please enter company name', required)
                },
                salary: {
                    numeric: helpers.withMessage('Please enter valid salary', numeric),
                    maxLength: maxLength(8)
                }
            }
        }
    },
    methods: {
        handleProfileImage(event) {
            this.isProfileImageExtensionValid = true
            this.isProfileImageSizeValid = true
            if (!imageUploadValidation.checkExtension(event.target.files[0], ['jpg', 'jpeg', 'png'])) {
                this.isProfileImageExtensionValid = false
            }
            if (!imageUploadValidation.checkSize(event.target.files[0], 1000000)) {
                this.isProfileImageSizeValid = false
            }
            if (this.isProfileImageExtensionValid && this.isProfileImageSizeValid) {
                this.member.profile_image = this.$refs.profileImage.files[0]
            } else {
                this.member.profile_image = ''
                this.$refs.profileImage.value = null
            }
            
        },
        addMemberSubmit() {
            this.v$.$validate()
            if (!this.v$.$error) {
                this.$store.commit('setPageLoading', true)
                this.addMemberSubmitProcess()
            }
        },
        async addMemberSubmitProcess() {
            var _this = this;
            let formData = new FormData()
            formData.append('first_name', _this.member.first_name)
            formData.append('last_name', _this.member.last_name)
            formData.append('email', _this.member.email)
            formData.append('phone', _this.member.phone)
            formData.append('password', _this.member.password)
            if (_this.member.sex != '') {
                formData.append('sex', _this.member.sex)
            }
            if (_this.member.dob != '') {
                formData.append('dob', customHelper.dateFormat(_this.member.dob))
            }
            formData.append('city', _this.member.city)
            formData.append('pincode', _this.member.pincode)
            formData.append('state', _this.member.state)
            formData.append('country', _this.member.country)
            formData.append('full_address', _this.member.full_address)
            formData.append('company_name', _this.member.company_name)
            formData.append('salary', _this.member.salary)
            formData.append('profile_image', _this.member.profile_image)
            await axios({
                method: 'POST',
                url: '/users/create',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem(process.env.VUE_APP_BROWSER_STORAGE_KEY)}`
                }
            })
            .then(function (response) {
                _this.$store.commit('setPageLoading', false)
                if (response.status === 200 && response.data.isSuccess === 1) {
                    _this.v$.$reset()
                    _this.resetAll()
                    _this.$toast.success('Member has been added successfully')
                } else {
                    _this.$toast.error('Member not added, something went wrong')
                }
            })
            .catch(function (error) {
                _this.$store.commit('setPageLoading', false)
                _this.$toast.error(error.response.data.error_msg)
            })
        },
        backToMemberList() {
            this.$router.go(-1)
        },
        resetAll() {
            this.member.first_name = ''
            this.member.last_name = ''
            this.member.email = ''
            this.member.phone = ''
            this.member.sex = ''
            this.member.password = ''
            this.member.confirm_password = ''
            this.member.dob = ''
            this.member.full_address = ''
            this.member.city = ''
            this.member.pincode = ''
            this.member.state = ''
            this.member.country = ''
            this.member.company_name = ''
            this.member.salary = ''
            this.member.profile_image = ''
            this.isProfileImageExtensionValid = true
            this.isProfileImageSizeValid = true
            this.$refs.profileImage.value = null
        }
    },
    mounted() {
        this.$store.commit('setPageLoading', false)
    }
}
</script>

<style scoped>

</style>
