export const create_course = async (course_id: string, file: File) => {
    try{
        const response = await fetch(
            `http://localhost:8000/create_course/${course_id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ "pdf_file": file }),
            }
        )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
}

export const set_course_topic = async (course_id: string, topic: string) => {
    try{
        const response = await fetch(
            `http://localhost:8000/message/explain/set-topic/${course_id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ "message": topic }),
            }
        )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error setting course topic:', error);
        throw error;
    }
}

export const explain_course = async (course_id: string, explanation: string) => {
    try {
        const response = await fetch(
            `http://localhost:8000/message/explain/${course_id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ "message": explanation }),
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error explaining course:', error);
        throw error;
    }
}

export const generate_quiz = async (course_id: string) => {
    try {
        const response = await fetch(
            `http://localhost:8000/message/quiz/${course_id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error generating quiz:', error);
        throw error;
    }
}