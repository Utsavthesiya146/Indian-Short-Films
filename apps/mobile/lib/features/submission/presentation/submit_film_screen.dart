import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/api_service.dart';

class SubmitFilmScreen extends StatefulWidget {
  const SubmitFilmScreen({super.key});

  @override
  State<SubmitFilmScreen> createState() => _SubmitFilmScreenState();
}

class _SubmitFilmScreenState extends State<SubmitFilmScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _directorController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _videoUrlController = TextEditingController();
  final _posterUrlController = TextEditingController();

  final ApiService _apiService = ApiService();
  bool _submitted = false;
  bool _isSubmitting = false;
  String? _errorMessage;

  @override
  void dispose() {
    _titleController.dispose();
    _directorController.dispose();
    _descriptionController.dispose();
    _videoUrlController.dispose();
    _posterUrlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Submit Short Film', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
      body: _submitted
          ? Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.check_circle_outline_rounded, color: AppColors.teal, size: 70),
                  const SizedBox(height: 16),
                  const Text(
                    'Submission Successful!',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Your short film has been submitted for moderation review.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => setState(() => _submitted = false),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.card,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Submit Another Film'),
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Filmmaker Submission Portal',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Showcase your original short film to audiences nationwide.',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 20),

                    _buildTextField(_titleController, 'Film Title', 'e.g. Chai & Stories'),
                    const SizedBox(height: 12),
                    _buildTextField(_directorController, 'Director Name', 'e.g. Aarav Sharma'),
                    const SizedBox(height: 12),
                    _buildTextField(_descriptionController, 'Logline / Synopsis', 'Brief plot summary...', maxLines: 3),
                    const SizedBox(height: 12),
                    _buildTextField(_videoUrlController, 'Video Stream URL (MP4 / HLS)', 'https://...'),
                    const SizedBox(height: 12),
                    _buildTextField(_posterUrlController, 'Poster Image URL', 'https://...'),

                    const SizedBox(height: 24),

                    if (_errorMessage != null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 16.0),
                        child: Text(_errorMessage!, style: const TextStyle(color: Colors.redAccent)),
                      ),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton.icon(
                        onPressed: _isSubmitting
                            ? null
                            : () async {
                                if (_formKey.currentState?.validate() ?? false) {
                                  setState(() {
                                    _isSubmitting = true;
                                    _errorMessage = null;
                                  });
                                  try {
                                    await _apiService.submitFilm(
                                      title: _titleController.text,
                                      director: _directorController.text,
                                      description: _descriptionController.text,
                                      videoUrl: _videoUrlController.text,
                                      posterUrl: _posterUrlController.text,
                                    );
                                    if (mounted) {
                                      setState(() {
                                        _submitted = true;
                                      });
                                    }
                                  } catch (e) {
                                    if (mounted) {
                                      setState(() {
                                        _errorMessage = e.toString().replaceAll('Exception: ', '');
                                      });
                                    }
                                  } finally {
                                    if (mounted) {
                                      setState(() => _isSubmitting = false);
                                    }
                                  }
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.accent,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        icon: _isSubmitting
                            ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Icon(Icons.cloud_upload_rounded),
                        label: Text(
                          _isSubmitting ? 'Submitting...' : 'Submit Film for Review',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, String hint, {int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        TextFormField(
          controller: controller,
          maxLines: maxLines,
          style: const TextStyle(color: Colors.white, fontSize: 13),
          validator: (val) => (val == null || val.isEmpty) ? 'Required field' : null,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
            filled: true,
            fillColor: AppColors.card,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.accent),
            ),
          ),
        ),
      ],
    );
  }
}
