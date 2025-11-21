import Nav from '../components/Nav'
import axios from 'axios'
import { useState } from "react"
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const Onboarding = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        company_name: '',
        dob_day: '',
        dob_month: '',
        dob_year: '',
        show_gender: false,
        business_type: 'software',
        business_interest: 'hardware',
        email: cookies.Email,
        url: '',
        about: '',
        matches: []
    })

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put('http://localhost:8080/users', { formData })
            const success = response.status === 200
            if (success) navigate('/dashboard')
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        console.log('e', e)
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        const name = e.target.name

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    console.log(formData)

    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => { }}
                ShowModal={false}
            />
            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="company_name">Company Name</label>
                        <input
                            id="company_name"
                            name="company_name"
                            placeholder="Company Name"
                            type="text"
                            required={true}
                            value={formData.company_name}
                            onChange={handleChange}
                        />

                        <label>Founding Date</label>
                        <div className="multiple-input-container">
                            <input
                                id="dob_day"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                type="number"
                                value={formData.dob_day}
                                onChange={handleChange}
                            />
                            <input
                                id="dob_month"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                type="number"
                                value={formData.dob_month}
                                onChange={handleChange}
                            />
                            <input
                                id="dob_year"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                type="number"
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                        </div>

                        <label>Business Type</label>
                        <div className="multiple-input-container">
                            <input
                                id="software-business-type"
                                type="radio"
                                name="business_type"
                                value="software"
                                onChange={handleChange}
                                checked={formData.business_type === 'software'}
                            />
                            <label htmlFor="software-business-type">Software</label>
                            <input
                                id="hardware-business-type"
                                type="radio"
                                name="business_type"
                                value="hardware"
                                onChange={handleChange}
                                checked={formData.business_type === 'hardware'}
                            />
                            <label htmlFor="hardware-business-type">Hardware</label>
                        </div>

                        {/* <input
                            id="show-gender"
                            type="checkbox"
                            name="show_gender"
                            onChange={handleChange}
                            checked={formData.show_gender}
                        />
                        <label htmlFor="show-gender">Show gender on my profile</label> */}

                        <label>Show Me</label>
                        <div className="multiple-input-container">
                            <input
                                id="software-business-interest"
                                type="radio"
                                name="business_interest"
                                value="software"
                                onChange={handleChange}
                                checked={formData.business_interest === 'software'}
                            />
                            <label htmlFor="software-business-interest">Software</label>
                            <input
                                id="hardware-business-interest"
                                type="radio"
                                name="business_interest"
                                value="hardware"
                                onChange={handleChange}
                                checked={formData.business_interest === 'hardware'}
                            />
                            <label htmlFor="hardware-business-interest">Hardware</label>
                            <input
                                id="all-business-interest"
                                type="radio"
                                name="business_interest"
                                value="all"
                                onChange={handleChange}
                                checked={formData.business_interest === 'all'}
                            />
                            <label htmlFor="all-business-interest">All</label>
                        </div>

                        <label htmlFor="about">About Us</label>
                        <input
                            id="about"
                            name="about"
                            placeholder="We are ..."
                            type="text"
                            required={true}
                            value={formData.about}
                            onChange={handleChange}
                        />
                        <input type="submit" />
                    </section>

                    <section>
                        <label htmlFor="about">Brand Logo</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            // required={true}
                            onChange={handleChange}
                        />
                        <div className="photo-container">
                            {formData.url && <img src={formData.url} alt="Logo Brand Preview" />}
                        </div>
                    </section>
                </form>
            </div>
        </>
    )
}

export default Onboarding