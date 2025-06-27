import styles from './PostForm.module.scss';

const PostForm = ({ title, description, handleChange }) => {
    return (
        <>
            <div className={styles['form-group']}>
                <label htmlFor="title">Photo Title *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    required
                    placeholder="Give your photo a title"
                    className={styles['form-input']}
                />
            </div>

            <div className={styles['form-group']}>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={handleChange}
                    placeholder="Tell the story behind this capture..."
                    rows="4"
                    className={styles['form-textarea']}
                ></textarea>
            </div>
        </>
    );
};

export default PostForm;