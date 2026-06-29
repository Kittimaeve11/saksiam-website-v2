import {
    Box,
    Container,
    Grid,
    Skeleton,
    Paper,
} from "@mui/material";

const SkeletonSectionsLoan = () => {
    return (
        <Box sx={{ width: "100%" }}>
            {/* HERO */}
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: '#00000031',
                    minHeight: {
                        xs: 500,
                        md: 750,
                    },
                    py: { xs: 4, md: 8 },


                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Grid container spacing={4}>
                        {/* LEFT */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Skeleton
                                variant="text"
                                width="75%"
                                height={90}
                                animation="wave"
                            />

                            <Skeleton
                                variant="text"
                                width="55%"
                                height={50}
                                animation="wave"
                            />

                            <Skeleton
                                variant="text"
                                width="45%"
                                height={50}
                                animation="wave"
                            />

                            <Skeleton
                                variant="text"
                                width="65%"
                                height={35}
                                animation="wave"
                                sx={{ mb: 4 }}
                            />

                            <Box
                                sx={{
                                    mt: 6,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Skeleton
                                    variant="rounded"
                                    width="75%"
                                    height={260}
                                    animation="wave"
                                    sx={{
                                        borderRadius: 4,
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* RIGHT FORM */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: "40px",
                                    overflow: "hidden",
                                    border: "1px solid #eeeeee3d",
                                    bgcolor: "#ffffff4e",
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    height={100}
                                    animation="wave"
                                />

                                <Box sx={{ p: 4 }}>
                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                        <Box key={item} sx={{ mb: 3 }}>
                                            <Skeleton
                                                variant="text"
                                                width="35%"
                                                height={30}
                                                animation="wave"
                                            />

                                            <Skeleton
                                                variant="rounded"
                                                height={50}
                                                animation="wave"
                                            />
                                        </Box>
                                    ))}

                                    <Skeleton
                                        variant="rounded"
                                        height={52}
                                        animation="wave"
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CONTENT */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    {/* CARD 1 */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 10,
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width="60%"
                                height={45}
                                animation="wave"
                            />

                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton
                                    key={i}
                                    variant="text"
                                    width={`${95 - i * 8}%`}
                                    height={35}
                                    animation="wave"
                                />
                            ))}
                        </Paper>
                    </Grid>

                    {/* CARD 2 */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 10,
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width="65%"
                                height={45}
                                animation="wave"
                            />

                            <Grid container spacing={2}>
                                {[1, 2, 3, 4].map((i) => (
                                    <Grid key={i} size={{ xs: 6, md: 6 }}>
                                        <Skeleton
                                            variant="rounded"
                                            height={40}
                                            animation="wave"
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* CARD 3 */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 10,
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width="55%"
                                height={45}
                                animation="wave"
                            />

                            {[1, 2, 3].map((i) => (
                                <Skeleton
                                    key={i}
                                    variant="text"
                                    width={`${80 - i * 10}%`}
                                    height={35}
                                    animation="wave"
                                />
                            ))}
                        </Paper>
                    </Grid>

                    {/* CARD 4 */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 10,
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width="50%"
                                height={45}
                                animation="wave"
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 3,
                                    mt: 2,
                                }}
                            >
                                <Skeleton
                                    variant="circular"
                                    width={60}
                                    height={60}
                                    animation="wave"
                                />

                                <Skeleton
                                    variant="circular"
                                    width={60}
                                    height={60}
                                    animation="wave"
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* STEP SECTION */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ mt: 8 }}>
                            <Skeleton
                                variant="text"
                                width="30%"
                                height={70}
                                animation="wave"
                                sx={{ mx: "auto", mb: 4 }}
                            />

                            <Grid container spacing={4}>
                                {/* IMAGE */}
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Skeleton
                                        variant="rounded"
                                        height={450}
                                        animation="wave"
                                    />
                                </Grid>

                                {/* STEP LIST */}
                                <Grid size={{ xs: 12, md: 7 }}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                display: "flex",
                                                gap: 2,
                                                mb: 4,
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <Skeleton
                                                variant="circular"
                                                width={50}
                                                height={50}
                                                animation="wave"
                                            />

                                            <Box sx={{ flex: 1 }}>
                                                <Skeleton
                                                    variant="text"
                                                    width="45%"
                                                    height={35}
                                                    animation="wave"
                                                />

                                                <Skeleton
                                                    variant="text"
                                                    width="80%"
                                                    height={25}
                                                    animation="wave"
                                                />

                                                <Skeleton
                                                    variant="text"
                                                    width="65%"
                                                    height={25}
                                                    animation="wave"
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SkeletonSectionsLoan;