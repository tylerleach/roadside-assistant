<style>
.navigate {
    padding: 10px 0px 10px 0px;
}
</style>

<template>
    <div>
        <Col span="4" class="wrapper-navigate">
            <div class="navigate">
                <Menu theme="light" :active-name="activeName" width="auto">
                    <MenuItem name="admin" to="/admin">
                    User Management
                    </MenuItem>
                    <MenuItem name="report" to="/report">
                    Report
                    </MenuItem>
                </Menu>
            </div>
        </Col>
    </div>
</template>

<script>
export default {
    name: 'AdminSideNav',
    props: ['activeName', 'hasCreated']
};
</script>
