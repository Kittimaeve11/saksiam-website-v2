import { ComponentsTextModelProps } from '@/app/Utils/type'
import { Box, TextField, Typography, useTheme } from '@mui/material';
import React from 'react'

const BasicTextDetailField: React.FC<ComponentsTextModelProps> = ({
    name,
    titlename,
    subject,
    setsubject,
    topon,
    handleFieldChange,
    error,
    fieldKey,
    specify,
    row
}) => {
    const theme = useTheme();
    return (
        <Box sx={{ mt: topon }}>
            <Typography variant="h6" component="label" sx={{ alignItems: 'left' }}>
                {name}  {specify && <span style={{ color: theme.palette.error.main }}>*</span>}
            </Typography>
            <TextField
                required
                size="small"
                variant="outlined"
                multiline
                placeholder={titlename}
                fullWidth
                value={subject ?? ""}
                rows={row}
                onChange={(e) => {
                    setsubject(e.target.value)
                    handleFieldChange(fieldKey, e.target.value)
                }}
                slotProps={{
                    htmlInput: {
                        sx: { fontSize: theme.typography.body1.fontSize }
                    }
                }}

                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8, // 👈 ความโค้ง

                        '& fieldset': {
                            borderColor: error
                                ? theme.palette.error.main
                                : theme.palette.grey[300],
                            borderWidth: '1.5px',
                        },

                        '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                        },

                        '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: theme.palette.primary.main
                    },
                    '& .MuiInputBase-input': {
                        fontWeight: 300,
                        color: error ? theme.palette.error.main : theme.palette.text.primary
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: error ? theme.palette.error.main : theme.palette.grey[500],
                        opacity: 1
                    },

                    '& .MuiInputLabel-root.Mui-focused': {
                        color: theme.palette.primary.main
                    },
                    '& .MuiFormHelperText-root': {
                        fontSize: theme.typography.body1.fontSize,
                        fontWeight: 400,
                    },

                    fontSize: theme.typography.body1.fontSize,

                    mt: 1
                }}
                error={Boolean(error)}
                helperText={error}
            />
        </Box>
    )
}

export default BasicTextDetailField
