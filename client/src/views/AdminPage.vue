<style>
.user-table {
    margin: 10px;
}
</style>

<template>
    <div>
        <Navigation activeName="Admin"></Navigation>
        <div class="content">
            <Row>
                <AdminSideNav activeName="admin"></AdminSideNav>
                <Col span="16">
                    <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>
                    <Table border :loading="users.loading" :columns="columns12" :data="users.items" class="user-table">
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="error" size="small" @click="deleteU(index, row.id)">Delete</Button>
                        </template>
                    </Table>
                </Col>
                <Col span="4"><br></Col>
            </Row>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Navigation from '@/components/Navigation';
import AdminSideNav from '@/components/AdminSidebar';

export default {
    data () {
        return {
            columns12: [
                {
                    title: 'Username',
                    key: 'username'
                },
                {
                    title: 'First Name',
                    key: 'firstName'
                },
                {
                    title: 'Last Name',
                    key: 'lastName'
                },
                {
                    title: 'Role',
                    key: 'role',
                    filters: [
                        {
                            label: 'Admin',
                            value: 'Admin'
                        },
                        {
                            label: 'Member',
                            value: 'Member'
                        },
                        {
                            label: 'Professional',
                            value: 'Professional'
                        }
                    ],
                    filterMethod (value, row) {
                        return row.role.indexOf(value) > -1;
                    }
                },
                {
                    title: 'Action',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ]
        }
    },
    components: {
        'Navigation': Navigation,
        'AdminSideNav': AdminSideNav
    },
    computed: {
        ...mapState({
            account: state => state.account,
            users: state => state.users.all
        })
    },
    created () {
        this.getAllUsers();
    },
    methods: {
        ...mapActions('users', {
            getAllUsers: 'getAll',
            deleteUser: 'delete'
        }),
        deleteU(index, id) {
            // Adds another layer to deleting a user, even though redundant it reduces human error
            this.$Modal.confirm({
                title: 'Delete ' + id,
                content: '<p>Are you sure you want to delete this user?</p>',
                onOk: () => {
                    if (id == this.account.user._id) {
                        this.$Message.error('You cannot delete your own account!!!');
                    } else {
                        this.$Message.info(id + ' has been deleted from the system.');
                        this.deleteUser(id);
                        this.users.splice(index, 1); // Removes the user from the table
                    }
                }
            })
        }
    }
};
</script>