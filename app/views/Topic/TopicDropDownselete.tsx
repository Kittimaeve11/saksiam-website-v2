import { apiFetch } from '@/app/api/client';
import { useLocale } from '@/app/providers/LocaleContext';
import { BasicDropDownSeleteProps } from '@/app/Utils/type';
import {
    Box,
    MenuItem,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import useLockPageScroll from '@/app/components/form/useLockPageScroll';

interface TopicDropDownseleteitem {
    selecte: string | number | null;
    setSelected: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    topon?: number;
    titlename: string;
    fieldKey: string;
    specify?: boolean;
    handleFieldChange: (
        fieldName: string,
        value: unknown
    ) => void;
    error?: string;
}

const TopicDropDownselete: React.FC<
    TopicDropDownseleteitem
> = ({
    selecte,
    setSelected,
    topon,
    titlename,
    handleFieldChange,
    error,
    fieldKey,
    specify,
}) => {
    const theme = useTheme();
    const { messages } = useLocale();
    const [menuOpen, setMenuOpen] = useState(false);
    useLockPageScroll(menuOpen);

    const [data, setData] = useState<
        BasicDropDownSeleteProps[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res =
                    await apiFetch<
                        BasicDropDownSeleteProps[]
                    >('/api/topicapi');

                if (!res.status) {
                    throw new Error(
                        res.message || 'API Error'
                    );
                }

                setData(res.data || []);
            } catch (err) {
                console.error(
                    'Topic API Error:',
                    err
                );
            }
        };

        fetchData();
    }, []);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const name = event.target.value;

        setSelected(name);

        handleFieldChange(
            fieldKey,
            name
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                mt: topon ?? 0,
            }}
        >
            <Typography
                variant="h6"
                component="label"
            >
                {titlename}

                {specify && (
                    <span
                        style={{
                            color:
                                theme.palette.error.main,
                        }}
                    >
                        {' '}
                        *
                    </span>
                )}
            </Typography>

            <TextField
                select
                size="small"
                fullWidth
                value={selecte || '0'}
                onChange={handleChange}
                error={Boolean(error)}
                helperText={error}
                sx={{
                    mt: 1,

                    '& .MuiOutlinedInput-root': {
                        borderRadius: 999,

                        '& fieldset': {
                            borderColor: error
                                ? theme.palette.error.main
                                : theme.palette.grey[300],
                            borderWidth: 1.5,
                        },

                        '&:hover fieldset': {
                            borderColor:
                                theme.palette.primary.main,
                        },

                        '&.Mui-focused fieldset': {
                            borderColor:
                                theme.palette.primary.main,
                            borderWidth: 2,
                        },
                    },
                }}
                slotProps={{
                    select: {
                        onOpen: () => setMenuOpen(true),
                        onClose: () => setMenuOpen(false),
                        MenuProps: {
                            disableScrollLock: true,
                            slotProps: {
                                paper: {
                                    sx: {
                                        maxHeight: 300,
                                        overflowY: 'auto',
                                    },
                                },
                            },
                        },
                    },
                }}
            >
                <MenuItem value="0">
                    <Box
                        sx={{
                            color: error
                                ? theme.palette.error.main
                                : theme.palette.grey[500],
                        }}
                    >
                        {messages.selete}
                        {titlename}
                    </Box>
                </MenuItem>

                {data.map((item) => (
                    <MenuItem
                        key={item.id}
                        value={item.name}
                    >
                        {item.name}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

export default TopicDropDownselete;
